import Fastify, { FastifyReply, FastifyRequest } from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import fastifyStatic from '@fastify/static'
import cookie from '@fastify/cookie'
import { PrismaClient } from '@prisma/client'
import path from 'path'
import { fileURLToPath } from 'url'
import { getConfig, validateConfig } from '@linea/config'

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load configuration
const config = getConfig()
validateConfig(config)

const app = Fastify({
  logger: config.observability.LOG_FORMAT === 'pretty' ? {
    level: config.observability.LOG_LEVEL,
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname'
      }
    }
  } : {
    level: config.observability.LOG_LEVEL,
    formatters: {
      level: (label) => ({ level: label })
    }
  },
  requestIdHeader: 'x-request-id',
  requestIdLogLabel: 'reqId',
  genReqId: () => crypto.randomUUID()
})

// Initialize Prisma
const prisma = new PrismaClient({
  log: config.development.DEBUG_SQL ? ['query', 'info', 'warn', 'error'] : ['error'],
  datasources: {
    db: {
      url: config.database.DATABASE_URL
    }
  }
})

// Register plugins
await app.register(cors, {
  origin: config.server.CORS_ORIGIN,
  credentials: config.server.CORS_CREDENTIALS
})

await app.register(helmet, {
  contentSecurityPolicy: false
})

await app.register(rateLimit, {
  max: config.security.RATE_LIMIT_MAX_REQUESTS,
  timeWindow: config.security.RATE_LIMIT_WINDOW_MS
})

await app.register(cookie, {
  secret: config.security.SESSION_SECRET,
})

await app.register(swagger, {
  openapi: {
    info: {
      title: 'Linea API',
      description: 'Event management platform API',
      version: config.environment.APP_VERSION
    },
    servers: [
      {
        url: config.server.API_URL,
        description: `${config.environment.NODE_ENV} server`
      }
    ]
  }
})

await app.register(swaggerUi, {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'list',
    deepLinking: false
  }
})

// Serve static files from the frontend build
await app.register(fastifyStatic, {
  root: path.join(__dirname, '../../web/dist'),
  prefix: '/'
})

// ------------ Auth utilities ------------
const getSessionUser = async (request: FastifyRequest) => {
  const cookieName = config.security.SESSION_COOKIE_NAME || 'linea_session'
  const token = (request.cookies as Record<string, string | undefined>)?.[cookieName]
  if (!token) return null
  const session = await prisma.session.findFirst({
    where: { token, expiresAt: { gt: new Date() }, deletedAt: null },
    include: { user: true }
  })
  if (!session?.user || !session.user.isActive) return null
  return session.user
}

const requireAuth = async (request: FastifyRequest, reply: FastifyReply) => {
  const user = await getSessionUser(request)
  if (!user) {
    reply.code(401).send({ error: 'Unauthorized' })
    return null
  }
  return user
}

const requireOwnerOrAdmin = async (request: FastifyRequest, reply: FastifyReply) => {
  const user = await requireAuth(request, reply)
  if (!user) return null
  if (user.role !== 'OWNER' && user.role !== 'ADMIN') {
    reply.code(403).send({ error: 'Forbidden' })
    return null
  }
  return user
}

const toSlug = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

const generateUniqueSlug = async (baseTitle: string) => {
  const base = toSlug(baseTitle)
  if (!base) {
    return crypto.randomUUID().slice(0, 8)
  }
  const existing = await prisma.event.findFirst({ where: { slug: base } })
  if (!existing) return base
  for (let i = 2; i < 1000; i++) {
    const candidate = `${base}-${i}`
    const found = await prisma.event.findFirst({ where: { slug: candidate } })
    if (!found) return candidate
  }
  return `${base}-${crypto.randomUUID().slice(0, 6)}`
}

// Health check
app.get('/health', async (_request, reply) => {
  try {
    const services: Record<string, string> = {}
    
    // Check database connection
      try {
        await Promise.race([
          prisma.$queryRaw`SELECT 1`,
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Database connection timeout')), 5000)
          )
        ])
        services.database = 'connected'
      } catch (dbError) {
        services.database = 'disconnected'
      app.log.warn({ error: dbError }, 'Database health check failed')
    }

    // Check Redis connection (if configured)
    // TODO: Add Redis health check when Redis is implemented

    const isHealthy = services.database === 'connected'

    return {
      status: isHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      version: config.environment.APP_VERSION,
      environment: config.environment.NODE_ENV,
      services
    }
  } catch (error) {
    // Unexpected error: still return 200 with degraded to avoid flapping deployments
    return {
      status: 'degraded',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
})

// Basic API routes - removed root route to allow static file serving

// Events API
app.get('/api/events', async (request, reply) => {
  try {
    const { search, category, status, featured } = request.query as {
      search?: string
      category?: string
      status?: string
      featured?: string
    }

    const where: Record<string, unknown> = {
      isPublic: true,
      deletedAt: null
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { shortDescription: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (category) {
      where.category = { slug: category }
    }

    if (status && ['DRAFT','PUBLISHED','CANCELLED','COMPLETED'].includes(status)) {
      where.status = status
    }

    if (featured === 'true') {
      where.featured = true
    }

    const events = await prisma.event.findMany({
      where,
      include: {
        owner: {
          select: { id: true, name: true, email: true }
        },
        venue: {
          select: { id: true, name: true, address: true, city: true, country: true }
        },
        category: {
          select: { id: true, name: true, slug: true, color: true, icon: true }
        },
        _count: {
          select: { waitlist: true }
        }
      },
      orderBy: [
        { featured: 'desc' },
        { startDate: 'asc' }
      ],
      take: 50
    })

    return { events }
  } catch (error) {
    app.log.error({ error }, 'Failed to fetch events')
    reply.code(500).send({ error: 'Failed to fetch events' })
  }
})

app.get('/api/events/:slug', async (request, reply) => {
  try {
  const { slug } = request.params as { slug: string }
  
    const event = await prisma.event.findFirst({
      where: {
        slug,
        isPublic: true,
        deletedAt: null
      },
      include: {
        owner: {
          select: { id: true, name: true, email: true }
        },
        venue: {
          select: { id: true, name: true, address: true, city: true, country: true, latitude: true, longitude: true }
        },
        category: {
          select: { id: true, name: true, slug: true, color: true, icon: true }
        },
        shows: {
          where: { deletedAt: null },
          orderBy: { startDate: 'asc' }
        },
        nearbyPlaces: {
          orderBy: { distance: 'asc' },
          take: 10
        },
        _count: {
          select: { waitlist: true }
        }
      }
    })

    if (!event) {
      reply.code(404).send({ error: 'Event not found' })
      return
    }

    return { event }
  } catch (error) {
    app.log.error({ error }, 'Failed to fetch event')
    reply.code(500).send({ error: 'Failed to fetch event' })
  }
})

// ------------- Owner-scoped Events CRUD -------------
type CreateEventBody = {
  title: string
  description?: string | null
  shortDescription?: string | null
  startDate: string
  endDate?: string | null
  capacity?: number | null
  venueId?: string | null
  categoryId?: string | null
  isPublic?: boolean
  featured?: boolean
  tags?: string[]
}

type UpdateEventBody = Partial<CreateEventBody> & { status?: 'DRAFT'|'PUBLISHED'|'CANCELLED'|'COMPLETED' }
// List events for current owner
app.get('/api/owner/events', async (request, reply) => {
  try {
    const user = await requireOwnerOrAdmin(request, reply)
    if (!user) return
    const where: Record<string, unknown> = user.role === 'OWNER' ? { ownerId: user.id, deletedAt: null } : { deletedAt: null }
    const events = await prisma.event.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { shows: true, waitlist: true } } }
    })
    return { events }
  } catch (error) {
    app.log.error({ error }, 'Failed to list owner events')
    reply.code(500).send({ error: 'Failed to list events' })
  }
})

// Create event
app.post('/api/owner/events', async (request, reply) => {
  try {
    const user = await requireOwnerOrAdmin(request, reply)
    if (!user) return
    const body = request.body as CreateEventBody
    const {
      title,
      description,
      shortDescription,
      startDate,
      endDate,
      capacity,
      venueId,
      categoryId,
      isPublic,
      featured,
      tags
    } = body || {}
    if (!title || !startDate) {
      reply.code(400).send({ error: 'Missing required fields: title, startDate' })
      return
    }
    const slug = await generateUniqueSlug(title)
    const event = await prisma.event.create({
      data: {
        title,
        slug,
        description: description ?? null,
        shortDescription: shortDescription ?? null,
        status: (isPublic ? 'PUBLISHED' : 'DRAFT'),
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        capacity: capacity ?? null,
        ownerId: user.id,
        venueId: venueId || null,
        categoryId: categoryId || null,
        isPublic: !!isPublic,
        featured: !!featured,
        tags: Array.isArray(tags) ? tags : []
      }
    })
    reply.code(201).send({ event })
  } catch (error) {
    app.log.error({ error }, 'Failed to create event')
    reply.code(500).send({ error: 'Failed to create event' })
  }
})

// Update event
app.put('/api/owner/events/:id', async (request, reply) => {
  try {
    const user = await requireOwnerOrAdmin(request, reply)
    if (!user) return
    const { id } = request.params as { id: string }
    const existing = await prisma.event.findFirst({ where: { id, deletedAt: null } })
    if (!existing) {
      reply.code(404).send({ error: 'Event not found' })
      return
    }
    if (user.role === 'OWNER' && existing.ownerId !== user.id) {
      reply.code(403).send({ error: 'Forbidden' })
      return
    }
    const body = request.body as UpdateEventBody
    const data: Record<string, unknown> = {}
    if (typeof body.title === 'string' && body.title !== existing.title) {
      data.title = body.title
    }
    if (typeof body.description !== 'undefined') data.description = body.description ?? null
    if (typeof body.shortDescription !== 'undefined') data.shortDescription = body.shortDescription ?? null
    if (typeof body.status === 'string') data.status = body.status
    if (typeof body.startDate === 'string') data.startDate = new Date(body.startDate)
    if (typeof body.endDate !== 'undefined') data.endDate = body.endDate ? new Date(body.endDate) : null
    if (typeof body.capacity !== 'undefined') data.capacity = body.capacity ?? null
    if (typeof body.venueId !== 'undefined') data.venueId = body.venueId || null
    if (typeof body.categoryId !== 'undefined') data.categoryId = body.categoryId || null
    if (typeof body.isPublic === 'boolean') data.isPublic = body.isPublic
    if (typeof body.featured === 'boolean') data.featured = body.featured
    if (Array.isArray(body.tags)) data.tags = body.tags
    if (typeof body.title === 'string' && body.title !== existing.title) {
      data.slug = await generateUniqueSlug(body.title)
    }
    const event = await prisma.event.update({ where: { id }, data })
    return { event }
  } catch (error) {
    app.log.error({ error }, 'Failed to update event')
    reply.code(500).send({ error: 'Failed to update event' })
  }
})

// Delete (soft) event
app.delete('/api/owner/events/:id', async (request, reply) => {
  try {
    const user = await requireOwnerOrAdmin(request, reply)
    if (!user) return
    const { id } = request.params as { id: string }
    const existing = await prisma.event.findFirst({ where: { id, deletedAt: null } })
    if (!existing) {
      reply.code(404).send({ error: 'Event not found' })
      return
    }
    if (user.role === 'OWNER' && existing.ownerId !== user.id) {
      reply.code(403).send({ error: 'Forbidden' })
      return
    }
    await prisma.event.update({ where: { id }, data: { deletedAt: new Date() } })
    reply.send({ ok: true })
  } catch (error) {
    app.log.error({ error }, 'Failed to delete event')
    reply.code(500).send({ error: 'Failed to delete event' })
  }
})

// ------------- Owner-scoped Shows CRUD -------------
type CreateShowBody = {
  title: string
  description?: string | null
  startDate: string
  endDate?: string | null
  capacity?: number | null
  youtubeUrl?: string | null
}

type UpdateShowBody = Partial<CreateShowBody>
// Create show for an event
app.post('/api/owner/events/:eventId/shows', async (request, reply) => {
  try {
    const user = await requireOwnerOrAdmin(request, reply)
    if (!user) return
    const { eventId } = request.params as { eventId: string }
    const event = await prisma.event.findFirst({ where: { id: eventId, deletedAt: null } })
    if (!event) { reply.code(404).send({ error: 'Event not found' }); return }
    if (user.role === 'OWNER' && event.ownerId !== user.id) { reply.code(403).send({ error: 'Forbidden' }); return }
    const body = request.body as CreateShowBody
    const { title, description, startDate, endDate, capacity, youtubeUrl } = body || {}
    if (!title || !startDate) { reply.code(400).send({ error: 'Missing required fields: title, startDate' }); return }
    const show = await prisma.show.create({
      data: {
        eventId,
        title,
        description: description ?? null,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        capacity: capacity ?? null,
        youtubeUrl: youtubeUrl ?? null
      }
    })
    reply.code(201).send({ show })
  } catch (error) {
    app.log.error({ error }, 'Failed to create show')
    reply.code(500).send({ error: 'Failed to create show' })
  }
})

// Update show
app.put('/api/owner/shows/:id', async (request, reply) => {
  try {
    const user = await requireOwnerOrAdmin(request, reply)
    if (!user) return
    const { id } = request.params as { id: string }
    const existing = await prisma.show.findFirst({ where: { id, deletedAt: null }, include: { event: true } })
    if (!existing) { reply.code(404).send({ error: 'Show not found' }); return }
    if (user.role === 'OWNER' && existing.event.ownerId !== user.id) { reply.code(403).send({ error: 'Forbidden' }); return }
    const body = request.body as UpdateShowBody
    const data: Record<string, unknown> = {}
    if (typeof body.title === 'string') data.title = body.title
    if (typeof body.description !== 'undefined') data.description = body.description ?? null
    if (typeof body.startDate === 'string') data.startDate = new Date(body.startDate)
    if (typeof body.endDate !== 'undefined') data.endDate = body.endDate ? new Date(body.endDate) : null
    if (typeof body.capacity !== 'undefined') data.capacity = body.capacity ?? null
    if (typeof body.youtubeUrl !== 'undefined') data.youtubeUrl = body.youtubeUrl ?? null
    const show = await prisma.show.update({ where: { id }, data })
    return { show }
  } catch (error) {
    app.log.error({ error }, 'Failed to update show')
    reply.code(500).send({ error: 'Failed to update show' })
  }
})

// Delete (soft) show
app.delete('/api/owner/shows/:id', async (request, reply) => {
  try {
    const user = await requireOwnerOrAdmin(request, reply)
    if (!user) return
    const { id } = request.params as { id: string }
    const existing = await prisma.show.findFirst({ where: { id, deletedAt: null }, include: { event: true } })
    if (!existing) { reply.code(404).send({ error: 'Show not found' }); return }
    if (user.role === 'OWNER' && existing.event.ownerId !== user.id) { reply.code(403).send({ error: 'Forbidden' }); return }
    await prisma.show.update({ where: { id }, data: { deletedAt: new Date() } })
    reply.send({ ok: true })
  } catch (error) {
    app.log.error({ error }, 'Failed to delete show')
    reply.code(500).send({ error: 'Failed to delete show' })
  }
})

// Waitlist API
app.post('/api/waitlist', async (request, reply) => {
  try {
  const { email, eventId } = request.body as { email: string; eventId: string }
  
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      reply.code(400).send({ error: 'Invalid email format' })
      return
    }

    // Check if event exists and is public
    const event = await prisma.event.findFirst({
      where: {
        id: eventId,
        isPublic: true,
        deletedAt: null
      }
    })

    if (!event) {
      reply.code(404).send({ error: 'Event not found' })
      return
    }

    // Check if already on waitlist
    const existingEntry = await prisma.waitlistEntry.findFirst({
      where: {
        email,
        eventId,
        deletedAt: null
      }
    })

    if (existingEntry) {
      reply.code(409).send({ error: 'Email already on waitlist for this event' })
      return
    }

    // Create waitlist entry
    const waitlistEntry = await prisma.waitlistEntry.create({
      data: {
        email,
        eventId,
        status: 'PENDING'
      }
    })

    // Update event waitlist count
    await prisma.event.update({
      where: { id: eventId },
      data: {
        currentWaitlist: {
          increment: 1
        }
      }
    })

  return {
    waitlistEntry: {
        id: waitlistEntry.id,
        email: waitlistEntry.email,
        eventId: waitlistEntry.eventId,
        status: waitlistEntry.status,
        createdAt: waitlistEntry.createdAt
      }
    }
  } catch (error) {
    app.log.error({ error }, 'Failed to create waitlist entry')
    reply.code(500).send({ error: 'Failed to join waitlist' })
  }
})

// Categories API
app.get('/api/categories', async (_request, reply) => {
  try {
    const categories = await prisma.category.findMany({
      where: {
        isActive: true,
        deletedAt: null
      },
      orderBy: { name: 'asc' }
    })

    return { categories }
  } catch (error) {
    app.log.error({ error }, 'Failed to fetch categories')
    reply.code(500).send({ error: 'Failed to fetch categories' })
  }
})

// Auth: Request magic link
app.post('/auth/request-magic-link', async (request, reply) => {
  const { email } = request.body as { email: string }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email || !emailRegex.test(email)) {
    reply.code(400).send({ error: 'Invalid email' })
    return
  }

  const token = crypto.randomUUID()
  const expiresAt = new Date(Date.now() + 1000 * 60 * 15)

  await prisma.emailVerification.create({
    data: {
      email,
      token,
      type: 'MAGIC_LINK',
      expiresAt,
    }
  })

  const callbackUrl = new URL('/auth/callback', config.server.API_URL)
  callbackUrl.searchParams.set('token', token)

  // TODO: Integrate SendGrid; for dev, log link
  app.log.info({ email, callbackUrl: callbackUrl.toString() }, 'Magic link generated')

  reply.send({ ok: true })
})

// Auth: Magic link callback
app.get('/auth/callback', async (request, reply) => {
  const { token } = request.query as { token?: string }
  if (!token) {
    reply.code(400).send({ error: 'Missing token' })
    return
  }

  const record = await prisma.emailVerification.findFirst({
    where: {
      token,
      type: 'MAGIC_LINK',
      verifiedAt: null,
      expiresAt: { gt: new Date() },
    }
  })

  if (!record) {
    reply.code(400).send({ error: 'Invalid or expired token' })
    return
  }

  // Upsert user
  const user = await prisma.user.upsert({
    where: { email: record.email },
    update: { lastLoginAt: new Date(), isActive: true },
    create: { email: record.email, role: 'VISITOR', isActive: true, lastLoginAt: new Date() }
  })

  // Mark verification used
  await prisma.emailVerification.update({
    where: { id: record.id },
    data: { verifiedAt: new Date(), userId: user.id }
  })

  // Create session
  const session = await prisma.session.create({
    data: {
      userId: user.id,
      token: crypto.randomUUID(),
      expiresAt: new Date(Date.now() + (config.security.SESSION_COOKIE_MAX_AGE || 7 * 24 * 60 * 60 * 1000))
    }
  })

  reply.setCookie(
    config.security.SESSION_COOKIE_NAME || 'linea_session',
    session.token,
    {
      path: '/',
      httpOnly: true,
      sameSite: (config.security.SESSION_COOKIE_SAME_SITE as 'lax'|'strict'|'none' | undefined) || 'lax',
      secure: !!config.security.SESSION_COOKIE_SECURE,
      maxAge: Math.floor((config.security.SESSION_COOKIE_MAX_AGE || 604800000) / 1000),
    }
  )

  // Redirect to frontend
  reply.redirect(config.server.FRONTEND_URL || '/')
})

// Auth: Current user
app.get('/auth/me', async (request, reply) => {
  try {
    const cookieName = config.security.SESSION_COOKIE_NAME || 'linea_session'
    const token = (request.cookies as Record<string, string | undefined>)?.[cookieName]
    if (!token) {
      reply.code(401).send({ authenticated: false })
      return
    }
    const session = await prisma.session.findFirst({
      where: { token, expiresAt: { gt: new Date() }, deletedAt: null },
      include: { user: true }
    })
    if (!session || !session.user) {
      reply.code(401).send({ authenticated: false })
      return
    }
    reply.send({
      authenticated: true,
      user: { id: session.user.id, email: session.user.email, role: session.user.role, name: session.user.name }
    })
  } catch (error) {
    app.log.error({ error }, 'Failed to get current user')
    reply.code(500).send({ error: 'Failed to get current user' })
  }
})

// Collect visitor email for quick registration
app.post('/collect-email', async (request, reply) => {
  try {
    const { email } = request.body as { email: string }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || !emailRegex.test(email)) {
      reply.code(400).send({ error: 'Invalid email' })
      return
    }
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: { email, role: 'VISITOR', isActive: true }
    })
    await prisma.auditLog.create({
      data: {
        action: 'EMAIL_COLLECT',
        resource: 'VisitorEmail',
        resourceId: user.id,
        ipAddress: ((request.ip as string) || null),
        userAgent: ((request.headers['user-agent'] as string) || null),
        metadata: { email }
      }
    })
    reply.send({ ok: true })
  } catch (error) {
    app.log.error({ error }, 'Failed to collect email')
    reply.code(500).send({ error: 'Failed to collect email' })
  }
})

// Sign out
app.post('/auth/signout', async (request, reply) => {
  try {
    const cookieName = config.security.SESSION_COOKIE_NAME || 'linea_session'
    const token = (request.cookies as Record<string, string | undefined>)?.[cookieName]
    if (token) {
      await prisma.session.updateMany({ where: { token }, data: { deletedAt: new Date() } })
    }
    reply.clearCookie(cookieName, { path: '/' })
    reply.send({ ok: true })
  } catch (error) {
    app.log.error({ error }, 'Failed to sign out')
    reply.code(500).send({ error: 'Failed to sign out' })
  }
})

// Catch-all handler: send back React's index.html file for client-side routing
app.setNotFoundHandler(async (_request, reply) => {
  // Only serve index.html for non-API routes
  if (!_request.url.startsWith('/api') && !_request.url.startsWith('/docs') && !_request.url.startsWith('/health')) {
    return reply.sendFile('index.html')
  }
  reply.code(404).send({ error: 'Not Found' })
})

// Error handler
app.setErrorHandler((error, _request, reply) => {
  app.log.error({ error }, 'API Error')

  if (error.validation) {
    reply.code(400).send({
      error: 'Validation Error',
      message: error.message,
      details: error.validation
    })
    return
  }

  reply.code(500).send({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  })
})

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  app.log.info(`Received ${signal}, shutting down gracefully`)

  try {
    await app.close()
    if (prisma) {
      await prisma.$disconnect()
    }
    process.exit(0)
  } catch (error) {
    app.log.error({ error }, 'Error during shutdown')
    process.exit(1)
  }
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.on('SIGINT', () => gracefulShutdown('SIGINT'))

// Start server
const start = async () => {
  try {
    const port = config.server.PORT
    const host = config.server.HOST

    await app.listen({ port, host })
    app.log.info(`Server listening on http://${host}:${port}`)
    app.log.info(`API documentation available at http://${host}:${port}/docs`)
    app.log.info(`Environment: ${config.environment.NODE_ENV}`)
    app.log.info(`Version: ${config.environment.APP_VERSION}`)
  } catch (error) {
    app.log.error({ error }, 'Failed to start server')
    process.exit(1)
  }
}

start()