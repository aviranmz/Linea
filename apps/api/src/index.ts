import Fastify, { FastifyReply, FastifyRequest } from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import fastifyStatic from '@fastify/static'
import cookie from '@fastify/cookie'
import { PrismaClient, Prisma } from '@prisma/client'
import * as Sentry from '@sentry/node'
import path from 'path'
import { fileURLToPath } from 'url'
import { getConfig, validateConfig } from '@linea/config'
import { sessionService } from './services/sessionService.js'

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Minimal email helper (SendGrid optional)
// TODO(prod): Replace with robust email service + templates
const sendEmail = async (to: string, subject: string, text: string) => {
  try {
    const key = process.env.SENDGRID_API_KEY || config.email.SENDGRID_API_KEY
    if (!key) {
      app.log.info({ to, subject, text }, 'Email (log only, no SENDGRID_API_KEY)')
      return
    }
    const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: { email: config.email.SENDGRID_FROM_EMAIL, name: config.email.SENDGRID_FROM_NAME },
        subject,
        content: [{ type: 'text/plain', value: text }]
      })
    })
    if (!res.ok) {
      const body = await res.text()
      app.log.warn({ status: res.status, body }, 'SendGrid send failed')
    }
  } catch (err) {
    app.log.warn({ err }, 'Email send error')
  }
}

// TODO(prod): Temporary mock events fallback for environments without DB/auth.
// Remove this once DATABASE_URL is configured and seeding/migrations are in place.
const mockEvents = [
  {
    id: 'event-1',
    title: 'Future of Kitchen Design Summit',
    slug: 'future-kitchen-design-summit',
    description: 'An exclusive summit exploring the latest trends and innovations in kitchen design.',
    shortDescription: 'Explore cutting-edge kitchen design trends.',
    status: 'PUBLISHED',
    startDate: '2025-10-26T09:00:00Z',
    endDate: '2025-10-27T17:00:00Z',
    capacity: 200,
    isPublic: true,
    featured: true,
    tags: ['design', 'innovation', 'kitchen', 'summit'],
    owner: { id: 'owner-1', name: 'Alice Wonderland', email: 'alice@kitchenco.com' },
    venue: { id: 'venue-1', name: 'Milano Design Center', address: 'Via Tortona, 37', city: 'Milano', country: 'Italy' },
    category: { id: 'cat-1', name: 'Design', slug: 'design', color: '#a855f7', icon: '🎨' },
    _count: { waitlist: 0 }
  },
  {
    id: 'event-2',
    title: 'Smart Kitchen Technology Expo',
    slug: 'smart-kitchen-tech-expo',
    description: 'Discover the newest smart appliances and integrated technologies for modern kitchens.',
    shortDescription: 'Newest smart appliances and integrated tech.',
    status: 'PUBLISHED',
    startDate: '2025-11-15T10:00:00Z',
    endDate: '2025-11-16T18:00:00Z',
    capacity: 150,
    isPublic: true,
    featured: false,
    tags: ['technology', 'smart home', 'kitchen', 'expo'],
    owner: { id: 'owner-2', name: 'Bob The Builder', email: 'bob@designbuild.com' },
    venue: { id: 'venue-2', name: 'Triennale di Milano', address: 'Viale Emilio Alemagna, 6', city: 'Milano', country: 'Italy' },
    category: { id: 'cat-2', name: 'Technology', slug: 'technology', color: '#3b82f6', icon: '💻' },
    _count: { waitlist: 0 }
  }
]

// Mock waitlist storage for fallback mode
const mockWaitlist: Array<{ id: string; email: string; eventId: string; status: 'PENDING'|'CONFIRMED' }> = []

// Load configuration
const config = getConfig()
validateConfig(config)

// In non-production or when explicitly allowed, show magic links in API responses
const shouldShowMagicLink = (
  process.env.SHOW_MAGIC_LINK === 'true' ||
  config.environment.NODE_ENV === 'development' ||
  !config.email.SENDGRID_API_KEY ||
  (typeof config.email.SENDGRID_API_KEY === 'string' && config.email.SENDGRID_API_KEY.includes('production-sendgrid'))
)

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

// Initialize Sentry if configured
if (config.observability.SENTRY_DSN) {
  Sentry.init({
    dsn: config.observability.SENTRY_DSN,
    environment: config.observability.SENTRY_ENVIRONMENT,
    release: config.observability.SENTRY_RELEASE,
    tracesSampleRate: 0.0
  })
}

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

// Structured request timing logs
app.addHook('onRequest', async (req) => {
  // @ts-expect-error attach start time
  req._start = Date.now()
  if (config.observability.SENTRY_DSN) {
    Sentry.addBreadcrumb({
      category: 'request',
      message: `${req.method} ${req.url}`,
      level: 'info'
    })
  }
})

app.addHook('onResponse', async (req, reply) => {
  const start = (req as { _start?: number })._start
  const ms = start ? Date.now() - start : undefined
  req.log.info({ method: req.method, url: req.url, statusCode: reply.statusCode, ms }, 'request completed')
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
  
  // Get session from Redis
  const sessionData = await sessionService.getSession(token)
  if (sessionData) {
    // Get user from database to ensure they're still active
    const user = await prisma.user.findFirst({
      where: { 
        id: sessionData.userId, 
        isActive: true,
        deletedAt: null 
      }
    })
    if (!user) {
      await sessionService.deleteSession(token)
      return null
    }
    return user
  }
  
  // Fallback: check DB sessions
  const dbSession = await prisma.session.findFirst({
    where: { token, expiresAt: { gt: new Date() } }
  })
  if (!dbSession) return null
  const user = await prisma.user.findFirst({
    where: { id: dbSession.userId, isActive: true, deletedAt: null }
  })
  if (!user) return null
  return user
}

// Helper function to create and set session
const createSessionAndSetCookie = async (reply: FastifyReply, user: { id: string, email: string, role: string, name?: string | null }) => {
  const sessionToken = crypto.randomUUID()
  const sessionDuration = config.security.SESSION_COOKIE_MAX_AGE || 7 * 24 * 60 * 60 * 1000
  
  await sessionService.createSession(sessionToken, {
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name || null
  }, sessionDuration)
  // Always persist DB session as fallback
  try {
    await prisma.session.create({
      data: {
        userId: user.id,
        token: sessionToken,
        expiresAt: new Date(Date.now() + sessionDuration)
      }
    })
  } catch (e) {
    // ignore if table missing in mock mode
  }

  reply.setCookie(
    config.security.SESSION_COOKIE_NAME || 'linea_session',
    sessionToken,
    {
      path: '/',
      httpOnly: true,
      sameSite: (config.security.SESSION_COOKIE_SAME_SITE as 'lax'|'strict'|'none' | undefined) || 'lax',
      secure: !!config.security.SESSION_COOKIE_SECURE,
      maxAge: Math.floor(sessionDuration / 1000),
    }
  )
  
  return sessionToken
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

const requireAdmin = async (request: FastifyRequest, reply: FastifyReply) => {
  const user = await requireAuth(request, reply)
  if (!user) return null
  if (user.role !== 'ADMIN') {
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
app.get('/health', async (_request, _reply) => {
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

    // Check Redis connection
    try {
      const isRedisHealthy = await sessionService.isHealthy()
      services.redis = isRedisHealthy ? 'connected' : 'disconnected'
    } catch (redisError) {
      services.redis = 'disconnected'
      app.log.warn({ error: redisError }, 'Redis health check failed')
    }

    const isHealthy = services.database === 'connected' && services.redis === 'connected'

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
app.get('/api/events', async (request, _reply) => {
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
    // TODO(prod): Remove mock fallback once DB is configured
    app.log.warn({ error }, 'DB unavailable, serving mock events')
    return { events: mockEvents }
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
      // Fall through to mock below
    }

    if (event) return { event }
  } catch (error) {
    // continue to mock
  }

  // TODO(prod): Remove mock fallback once DB is configured
  const { slug } = request.params as { slug: string }
  const mock = mockEvents.find(e => e.slug === slug)
  if (!mock) {
    reply.code(404).send({ error: 'Event not found' })
    return
  }
  return { event: mock }
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
  productName?: string | null
  heroImageUrl?: string | null
  longDescription?: string | null
  valueProposition?: string | null
  features?: string[]
  awards?: string[]
  social?: Record<string,string> | null
  videoUrl?: string | null
  pressKitUrl?: string | null
  contact?: { email?: string; phone?: string; whatsapp?: string; telegram?: string } | null
  schedule?: Array<{ title: string; startsAt: string; endsAt?: string }>
  qrUrl?: string | null
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
      tags,
      productName,
      heroImageUrl,
      longDescription,
      valueProposition,
      features,
      awards,
      social,
      videoUrl,
      pressKitUrl,
      contact,
      schedule,
      qrUrl
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
        tags: Array.isArray(tags) ? tags : [],
        metadata: {
          productName: productName ?? null,
          heroImageUrl: heroImageUrl ?? null,
          longDescription: longDescription ?? null,
          valueProposition: valueProposition ?? null,
          features: Array.isArray(features) ? features : [],
          awards: Array.isArray(awards) ? awards : [],
          social: social ?? null,
          videoUrl: videoUrl ?? null,
          pressKitUrl: pressKitUrl ?? null,
          contact: contact ?? null,
          schedule: Array.isArray(schedule) ? schedule : [],
          qrUrl: qrUrl ?? null
        }
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
    // Merge metadata updates if provided
    const meta: Record<string, unknown> = {}
    if (typeof body.productName !== 'undefined') meta.productName = body.productName
    if (typeof body.heroImageUrl !== 'undefined') meta.heroImageUrl = body.heroImageUrl
    if (typeof body.longDescription !== 'undefined') meta.longDescription = body.longDescription
    if (typeof body.valueProposition !== 'undefined') meta.valueProposition = body.valueProposition
    if (typeof body.features !== 'undefined') meta.features = Array.isArray(body.features) ? body.features : []
    if (typeof body.awards !== 'undefined') meta.awards = Array.isArray(body.awards) ? body.awards : []
    if (typeof body.social !== 'undefined') meta.social = body.social
    if (typeof body.videoUrl !== 'undefined') meta.videoUrl = body.videoUrl
    if (typeof body.pressKitUrl !== 'undefined') meta.pressKitUrl = body.pressKitUrl
    if (typeof body.contact !== 'undefined') meta.contact = body.contact
    if (typeof body.schedule !== 'undefined') meta.schedule = Array.isArray(body.schedule) ? body.schedule : []
    if (typeof body.qrUrl !== 'undefined') meta.qrUrl = body.qrUrl
    if (Object.keys(meta).length > 0) {
      // Read existing metadata to merge (avoid overwriting other keys)
      const current = await prisma.event.findUnique({ where: { id }, select: { metadata: true } })
      data.metadata = { ...(current?.metadata as Record<string, unknown> || {}), ...meta }
    }
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
    // Mock fallback if DB unavailable
    try {
      const { email, eventId } = request.body as { email: string; eventId: string }
      const exists = mockWaitlist.find(w => w.email === email && w.eventId === eventId)
      if (exists) { reply.code(409).send({ error: 'Email already on waitlist for this event' }); return }
      const id = crypto.randomUUID()
      mockWaitlist.push({ id, email, eventId, status: 'PENDING' })
      // Send mocked confirmation email
      await sendEmail(email, 'Confirm your waitlist', `Click to confirm: ${config.server.API_URL}/api/waitlist/confirm?email=${encodeURIComponent(email)}&eventId=${encodeURIComponent(eventId)}`)
      return { waitlistEntry: { id, email, eventId, status: 'PENDING', createdAt: new Date().toISOString() } }
    } catch (fallbackErr) {
      app.log.error({ error, fallbackErr }, 'Failed to create waitlist entry (mock and db)')
      reply.code(500).send({ error: 'Failed to join waitlist' })
    }
  }
})

// Confirm waitlist (double opt-in)
app.get('/api/waitlist/confirm', async (request, reply) => {
  const { email, eventId } = request.query as { email?: string; eventId?: string }
  if (!email || !eventId) { reply.code(400).send({ error: 'Missing email or eventId' }); return }
  try {
    const entry = await prisma.waitlistEntry.findFirst({ where: { email, eventId, deletedAt: null } })
    if (!entry) { reply.code(404).send({ error: 'Not found' }); return }
    if (entry.status !== 'CONFIRMED') {
      await prisma.waitlistEntry.update({ where: { id: entry.id }, data: { status: 'CONFIRMED' } })
    }
    reply.send({ ok: true })
  } catch (error) {
    const mock = mockWaitlist.find(w => w.email === email && w.eventId === eventId)
    if (!mock) { reply.code(404).send({ error: 'Not found' }); return }
    mock.status = 'CONFIRMED'
    reply.send({ ok: true })
  }
})

// Unsubscribe (remove from waitlist)
app.post('/api/waitlist/unsubscribe', async (request, reply) => {
  const { email, eventId } = request.body as { email: string; eventId: string }
  if (!email || !eventId) { reply.code(400).send({ error: 'Missing email or eventId' }); return }
  try {
    const entry = await prisma.waitlistEntry.findFirst({ where: { email, eventId, deletedAt: null } })
    if (!entry) { reply.code(404).send({ error: 'Not found' }); return }
    await prisma.waitlistEntry.update({ where: { id: entry.id }, data: { deletedAt: new Date() } })
    reply.send({ ok: true })
  } catch (error) {
    const idx = mockWaitlist.findIndex(w => w.email === email && w.eventId === eventId)
    if (idx === -1) { reply.code(404).send({ error: 'Not found' }); return }
    mockWaitlist.splice(idx, 1)
    reply.send({ ok: true })
  }
})

// Export waitlist CSV (owner/admin typically, but allow public for demo)
app.get('/api/waitlist/export', async (request, reply) => {
  const { eventId } = request.query as { eventId?: string }
  if (!eventId) { reply.code(400).send({ error: 'Missing eventId' }); return }
  try {
    const entries = await prisma.waitlistEntry.findMany({ where: { eventId, deletedAt: null }, orderBy: { createdAt: 'asc' } })
    const rows: string[][] = [["email","eventId","status","createdAt"], ...entries.map((e) => [e.email, e.eventId, String(e.status), e.createdAt.toISOString()])]
    const csv = rows.map(r => r.map(v => typeof v === 'string' && v.includes(',') ? `"${v.replace(/"/g,'""')}"` : String(v)).join(',')).join('\n')
    reply.header('Content-Type', 'text/csv')
    reply.header('Content-Disposition', `attachment; filename="waitlist-${eventId}.csv"`)
    return csv
  } catch (error) {
    const entries = mockWaitlist.filter(w => w.eventId === eventId)
    const rows: string[][] = [["email","eventId","status","createdAt"], ...entries.map(e => [e.email, e.eventId, String(e.status), new Date().toISOString()])]
    const csv = rows.map(r => r.map(v => typeof v === 'string' && v.includes(',') ? `"${v.replace(/"/g,'""')}"` : String(v)).join(',')).join('\n')
    reply.header('Content-Type', 'text/csv')
    reply.header('Content-Disposition', `attachment; filename="waitlist-${eventId}.csv"`)
    return csv
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

// -------- Admin Overview (RBAC: ADMIN only) --------
app.get('/api/admin/overview', async (request, reply) => {
  const user = await requireAdmin(request, reply)
  if (!user) return
  try {
    const [users, events, shows, waitlist] = await Promise.all([
      prisma.user.count({ where: { deletedAt: null } }),
      prisma.event.count({ where: { deletedAt: null } }),
      prisma.show.count({ where: { deletedAt: null } }),
      prisma.waitlistEntry.count({ where: { deletedAt: null } }),
    ])
    reply.send({ users, events, shows, waitlist })
  } catch (error) {
    // Mock fallback if DB unavailable
    reply.send({ users: 1, events: mockEvents.length, shows: 0, waitlist: 0 })
  }
})

// -------- Admin: Owners list (RBAC: ADMIN only) --------
app.get('/api/admin/owners', async (request, reply) => {
  const user = await requireAdmin(request, reply)
  if (!user) return
  try {
    const { page = '1', limit = '20', search, status } = request.query as {
      page?: string
      limit?: string
      search?: string
      status?: 'ACTIVE' | 'SUSPENDED'
    }
    const pageNum = Math.max(1, parseInt(page))
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)))

    const where: Record<string, unknown> = {
      role: 'OWNER',
      deletedAt: null,
      ...(status === 'ACTIVE' ? { isActive: true } : {}),
      ...(status === 'SUSPENDED' ? { isActive: false } : {}),
      ...(search
        ? {
            OR: [
              { email: { contains: search, mode: 'insensitive' } },
              { name: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    }

    const [total, owners] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
        select: {
          id: true,
          email: true,
          name: true,
          isActive: true,
          createdAt: true,
          _count: { select: { ownedEvents: true } },
        },
      }),
    ])

    reply.send({
      owners: owners.map((o: { id: string; email: string; name: string | null; isActive: boolean; createdAt: Date; _count: { ownedEvents: number } }) => ({
        id: o.id,
        email: o.email,
        name: o.name,
        organizationName: null,
        status: o.isActive ? 'ACTIVE' : 'SUSPENDED',
        createdAt: o.createdAt,
        eventCount: o._count.ownedEvents,
      })),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.max(1, Math.ceil(total / limitNum)),
      },
    })
  } catch (error) {
    request.log.error({ error }, 'Failed to list owners (admin)')
    reply.code(500).send({ error: 'Failed to list owners' })
  }
})

// -------- Admin: Events list + moderation (RBAC: ADMIN only) --------
app.get('/api/admin/events', async (request, reply) => {
  const user = await requireAdmin(request, reply)
  if (!user) return
  try {
    const { page = '1', limit = '20', status, search } = request.query as {
      page?: string
      limit?: string
      status?: 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED' | 'PENDING_REVIEW'
      search?: string
    }
    const pageNum = Math.max(1, parseInt(page))
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)))

    const where: Record<string, unknown> = {
      deletedAt: null,
      ...(status && ['DRAFT', 'PUBLISHED', 'CANCELLED', 'COMPLETED'].includes(status)
        ? { status }
        : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
              { shortDescription: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    }

    const [total, events] = await Promise.all([
      prisma.event.count({ where }),
      prisma.event.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
        select: {
          id: true,
          title: true,
          slug: true,
          status: true,
          createdAt: true,
          owner: { select: { name: true } },
          _count: { select: { waitlist: true } },
        },
      }),
    ])

    reply.send({
      events: events.map((e: { id: string; title: string; slug: string; status: string; createdAt: Date; owner?: { name: string | null } | null; _count: { waitlist: number } }) => ({
        id: e.id,
        title: e.title,
        slug: e.slug,
        status: e.status,
        ownerName: e.owner?.name || 'Unknown',
        waitlistCount: e._count.waitlist,
        createdAt: e.createdAt,
      })),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.max(1, Math.ceil(total / limitNum)),
      },
    })
  } catch (error) {
    request.log.error({ error }, 'Failed to list events (admin)')
    reply.code(500).send({ error: 'Failed to list events' })
  }
})

app.post('/api/admin/events/:id/approve', async (request, reply) => {
  const user = await requireAdmin(request, reply)
  if (!user) return
  try {
    const { id } = request.params as { id: string }
    const existing = await prisma.event.findFirst({ where: { id, deletedAt: null } })
    if (!existing) { reply.code(404).send({ error: 'Event not found' }); return }
    const updated = await prisma.event.update({ where: { id }, data: { status: 'PUBLISHED' } })
    await prisma.auditLog.create({
      data: {
        action: 'UPDATE',
        resource: 'Event',
        resourceId: id,
        userId: user.id,
        metadata: { action: 'approve' },
      },
    })
    reply.send({ ok: true, event: { id: updated.id, status: updated.status } })
  } catch (error) {
    request.log.error({ error }, 'Failed to approve event')
    reply.code(500).send({ error: 'Failed to approve event' })
  }
})

app.post('/api/admin/events/:id/reject', async (request, reply) => {
  const user = await requireAdmin(request, reply)
  if (!user) return
  try {
    const { id } = request.params as { id: string }
    const { reason } = request.body as { reason?: string }
    const existing = await prisma.event.findFirst({ where: { id, deletedAt: null } })
    if (!existing) { reply.code(404).send({ error: 'Event not found' }); return }
    const updated = await prisma.event.update({ where: { id }, data: { status: 'CANCELLED' } })
    await prisma.auditLog.create({
      data: {
        action: 'UPDATE',
        resource: 'Event',
        resourceId: id,
        userId: user.id,
        metadata: { action: 'reject', reason: reason || null },
      },
    })
    reply.send({ ok: true, event: { id: updated.id, status: updated.status } })
  } catch (error) {
    request.log.error({ error }, 'Failed to reject event')
    reply.code(500).send({ error: 'Failed to reject event' })
  }
})

// Owner Theme Settings CRUD (owner/admin)
app.get('/api/owner/theme', async (request, reply) => {
  const user = await requireOwnerOrAdmin(request, reply)
  if (!user) return
  try {
    const dbUser = await prisma.user.findUnique({ where: { id: user.id } })
    const themeValue = (dbUser as unknown as { theme?: unknown } | null)?.theme ?? null
    reply.send({ theme: themeValue })
  } catch (error) {
    reply.code(500).send({ error: 'Failed to fetch theme' })
  }
})

// Owner waitlist management
app.get('/api/owner/events/:eventId/waitlist', async (request, reply) => {
  const user = await requireOwnerOrAdmin(request, reply)
  if (!user) return
  const { eventId } = request.params as { eventId: string }
  const event = await prisma.event.findFirst({ where: { id: eventId, deletedAt: null }, select: { ownerId: true } })
  if (!event) { reply.code(404).send({ error: 'Event not found' }); return }
  if (user.role === 'OWNER' && event.ownerId !== user.id) { reply.code(403).send({ error: 'Forbidden' }); return }
  const entries = await prisma.waitlistEntry.findMany({ where: { eventId, deletedAt: null }, orderBy: { createdAt: 'asc' } })
  reply.send({ entries })
})

app.put('/api/owner/waitlist/:id', async (request, reply) => {
  const user = await requireOwnerOrAdmin(request, reply)
  if (!user) return
  const { id } = request.params as { id: string }
  const body = request.body as { status?: 'APPROVED'|'REJECTED'|'ARRIVED'|'CONFIRMED'|'CANCELLED' }
  const entry = await prisma.waitlistEntry.findUnique({ where: { id }, include: { event: true } })
  if (!entry || entry.deletedAt) { reply.code(404).send({ error: 'Not found' }); return }
  if (user.role === 'OWNER' && entry.event.ownerId !== user.id) { reply.code(403).send({ error: 'Forbidden' }); return }
  const allowedStatuses = Object.values(Prisma.WaitlistStatus)
  const nextStatus = (body.status && (allowedStatuses as readonly string[]).includes(body.status))
    ? (body.status as Prisma.WaitlistStatus)
    : Prisma.WaitlistStatus.CONFIRMED
  const updated = await prisma.waitlistEntry.update({ where: { id }, data: { status: { set: nextStatus } } })
  reply.send({ entry: updated })
})

app.put('/api/owner/theme', async (request, reply) => {
  const user = await requireOwnerOrAdmin(request, reply)
  if (!user) return
  try {
    const theme = request.body as unknown
    // Use `as unknown as Prisma.InputJsonValue` to satisfy varying Prisma versions
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { theme: (theme as unknown as Prisma.InputJsonValue) }
    })
    reply.send({ ok: true, theme: updated.theme as unknown })
  } catch (error) {
    reply.code(500).send({ error: 'Failed to update theme' })
  }
})

// Auth: Request magic link (ENHANCED WITH MOCK FUNCTIONALITY)
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

  // In development or when SHOW_MAGIC_LINK=true: return the magic link in response
  if (shouldShowMagicLink) {
    app.log.info({ email, callbackUrl: callbackUrl.toString() }, 'Magic link generated (dev mode)')
    reply.send({ 
      ok: true, 
      magicLink: callbackUrl.toString(),
      message: 'Magic link generated (development mode)',
      expiresIn: '15 minutes'
    })
  } else {
    // TODO: Integrate SendGrid for production
    app.log.info({ email, callbackUrl: callbackUrl.toString() }, 'Magic link generated')
    reply.send({ ok: true, message: 'Magic link sent to your email' })
  }
})

// Owner Registration (Enhanced Magic Link with Name)
app.post('/auth/register-owner', async (request, reply) => {
  const { email, name, organizationName } = request.body as { 
    email: string, 
    name: string, 
    organizationName?: string 
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email || !emailRegex.test(email)) {
    reply.code(400).send({ error: 'Invalid email' })
    return
  }
  
  if (!name?.trim()) {
    reply.code(400).send({ error: 'Name is required' })
    return
  }

  // Check if user already exists as owner
  const existingUser = await prisma.user.findUnique({ 
    where: { email } 
  })
  
  if (existingUser && existingUser.role === 'OWNER') {
    reply.code(400).send({ error: 'Owner account already exists with this email' })
    return
  }

  const token = crypto.randomUUID()
  const expiresAt = new Date(Date.now() + 1000 * 60 * 30) // 30 minutes for owner registration

  await prisma.emailVerification.create({
    data: {
      email,
      token,
      type: 'OWNER_INVITATION',
      expiresAt,
    }
  })

  const callbackUrl = new URL('/auth/owner-callback', config.server.API_URL)
  callbackUrl.searchParams.set('token', token)
  callbackUrl.searchParams.set('name', encodeURIComponent(name))
  if (organizationName) {
    callbackUrl.searchParams.set('org', encodeURIComponent(organizationName))
  }

  if (shouldShowMagicLink) {
    app.log.info({ email, name, callbackUrl: callbackUrl.toString() }, 'Owner registration link generated (dev mode)')
    reply.send({ 
      ok: true, 
      magicLink: callbackUrl.toString(),
      message: 'Owner registration link generated (development mode)',
      expiresIn: '30 minutes'
    })
  } else {
    // TODO: Send owner invitation email via SendGrid
    app.log.info({ email, name }, 'Owner registration link generated')
    reply.send({ ok: true, message: 'Owner registration link sent to your email' })
  }
})

// Owner Registration Callback
app.get('/auth/owner-callback', async (request, reply) => {
  const { token, name } = request.query as { 
    token?: string, 
    name?: string, 
  }
  
  if (!token) {
    reply.code(400).send({ error: 'Missing token' })
    return
  }

  const record = await prisma.emailVerification.findFirst({
    where: {
      token,
      type: 'OWNER_INVITATION',
      verifiedAt: null,
      expiresAt: { gt: new Date() },
    }
  })

  if (!record) {
    reply.code(400).send({ error: 'Invalid or expired registration token' })
    return
  }

  // Create or update user as OWNER
  const user = await prisma.user.upsert({
    where: { email: record.email },
    update: { 
      role: 'OWNER', 
      name: name ? decodeURIComponent(name) : null,
      lastLoginAt: new Date(), 
      isActive: true 
    },
    create: { 
      email: record.email, 
      role: 'OWNER', 
      name: name ? decodeURIComponent(name) : null,
      isActive: true, 
      lastLoginAt: new Date() 
    }
  })

  // Mark verification used
  await prisma.emailVerification.update({
    where: { id: record.id },
    data: { verifiedAt: new Date(), userId: user.id }
  })

  // Create session (Redis)
  await createSessionAndSetCookie(reply, {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name || null
  })

  // Redirect to owner portal
  reply.redirect(`${config.server.FRONTEND_URL}/owner-portal`)
})

// Admin Login (Username + Password)
app.post('/auth/admin-login', async (request, reply) => {
  const { email, password } = request.body as { email: string, password: string }
  
  if (!email || !password) {
    reply.code(400).send({ error: 'Email and password are required' })
    return
  }

  // Find admin user
  const user = await prisma.user.findFirst({
    where: { 
      email, 
      role: 'ADMIN',
      isActive: true 
    }
  })

  if (!user) {
    reply.code(401).send({ error: 'Invalid credentials' })
    return
  }

  // For now, check against seed admin password from env
  // In production, this should use proper password hashing (bcrypt)
  const isValidPassword = password === config.development.SEED_ADMIN_PASSWORD

  if (!isValidPassword) {
    reply.code(401).send({ error: 'Invalid credentials' })
    return
  }

  // Update last login
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() }
  })

  // Create session (Redis)
  await createSessionAndSetCookie(reply, {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name || null
  })

  reply.send({
    ok: true,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    }
  })
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

  // Create session (Redis)
  await createSessionAndSetCookie(reply, {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name || null
  })

  // Redirect to frontend
  reply.redirect(config.server.FRONTEND_URL || '/')
})

// Auth: Current user
app.get('/auth/me', async (request, reply) => {
  try {
    const user = await getSessionUser(request)
    if (!user) {
      reply.code(401).send({ authenticated: false })
      return
    }
    
    reply.send({
      authenticated: true,
      user: { 
        id: user.id, 
        email: user.email, 
        role: user.role, 
        name: user.name 
      }
    })
  } catch (error) {
    app.log.error({ error }, 'Failed to get current user')
    reply.code(500).send({ error: 'Failed to get current user' })
  }
})

// Dev-only: Generate non-expiring magic links for owners/admin
app.post('/auth/dev/generate-link', async (request, reply) => {
  if (!(shouldShowMagicLink || config.environment.NODE_ENV !== 'production')) {
    reply.code(403).send({ error: 'Forbidden' })
    return
  }
  const { email, role, name } = request.body as { email: string; role: 'OWNER'|'ADMIN'|'VISITOR'; name?: string }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) { reply.code(400).send({ error: 'Invalid email' }); return }

  // Upsert user with requested role
  const user = await prisma.user.upsert({
    where: { email },
    update: { role, name: name ?? null, isActive: true, lastLoginAt: new Date() },
    create: { email, role, name: name ?? null, isActive: true, lastLoginAt: new Date() }
  })

  // Create a non-expiring verification record (expires in 10 years)
  const token = crypto.randomUUID()
  await prisma.emailVerification.create({
    data: { email, token, type: 'MAGIC_LINK', expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 10) }
  })

  const callbackUrl = new URL('/auth/callback', config.server.API_URL)
  callbackUrl.searchParams.set('token', token)

  reply.send({ ok: true, magicLink: callbackUrl.toString(), user: { id: user.id, email: user.email, role: user.role } })
})

// Dev-only: Inspect email verification token state
app.get('/auth/dev/debug-token', async (request, reply) => {
  if (!(shouldShowMagicLink || config.environment.NODE_ENV !== 'production')) {
    reply.code(403).send({ error: 'Forbidden' })
    return
  }
  const { token } = request.query as { token?: string }
  if (!token) { reply.code(400).send({ error: 'Missing token' }); return }
  const record = await prisma.emailVerification.findFirst({ where: { token } })
  if (!record) { reply.code(404).send({ error: 'Not found' }); return }
  reply.send({
    id: record.id,
    email: record.email,
    type: record.type,
    verifiedAt: record.verifiedAt,
    expiresAt: record.expiresAt,
    isExpired: record.expiresAt <= new Date(),
  })
})

// Dev-only: direct login by email (no token). Creates user if needed and sets session.
app.post('/auth/dev/login', async (request, reply) => {
  if (!(shouldShowMagicLink || config.environment.NODE_ENV !== 'production')) {
    reply.code(403).send({ error: 'Forbidden' })
    return
  }
  const { email, role, name } = request.body as { email: string; role?: 'VISITOR'|'OWNER'|'ADMIN'; name?: string }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) { reply.code(400).send({ error: 'Invalid email' }); return }

  const desiredRole = role || 'VISITOR'
  const user = await prisma.user.upsert({
    where: { email },
    update: { role: desiredRole, name: name ?? null, isActive: true, lastLoginAt: new Date() },
    create: { email, role: desiredRole, name: name ?? null, isActive: true, lastLoginAt: new Date() }
  })

  await createSessionAndSetCookie(reply, { id: user.id, email: user.email, role: user.role, name: user.name || null })
  reply.send({ ok: true, user: { id: user.id, email: user.email, role: user.role, name: user.name } })
})

// Dev-only: reusable login link that creates a session and redirects
app.get('/auth/dev/login-link', async (request, reply) => {
  if (!(shouldShowMagicLink || config.environment.NODE_ENV !== 'production')) {
    reply.code(403).send({ error: 'Forbidden' })
    return
  }
  const { email, role, name, redirect } = request.query as { email?: string; role?: 'VISITOR'|'OWNER'|'ADMIN'; name?: string; redirect?: string }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email || !emailRegex.test(email)) { reply.code(400).send({ error: 'Invalid email' }); return }
  const desiredRole = (role || 'VISITOR')
  const user = await prisma.user.upsert({
    where: { email },
    update: { role: desiredRole, name: name ?? null, isActive: true, lastLoginAt: new Date() },
    create: { email, role: desiredRole, name: name ?? null, isActive: true, lastLoginAt: new Date() }
  })

  await createSessionAndSetCookie(reply, { id: user.id, email: user.email, role: user.role, name: user.name || null })

  const dest = redirect || (config.server.FRONTEND_URL || '/')
  reply.redirect(dest)
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
      await sessionService.deleteSession(token)
    try { await prisma.session.deleteMany({ where: { token } }) } catch (e) { app.log.warn({ e }, 'Failed to delete DB session during signout') }
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

  if (config.observability.SENTRY_DSN) {
    Sentry.captureException(error)
  }

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
    await sessionService.disconnect()
    process.exit(0)
  } catch (error) {
    app.log.error({ error }, 'Error during shutdown')
    process.exit(1)
  }
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.on('SIGINT', () => gracefulShutdown('SIGINT'))

// Run database migrations on startup
const runMigrations = async () => {
  try {
    app.log.info('🚀 Running database migrations...')
    
    // Test database connection first
    await prisma.$connect()
    app.log.info('✅ Database connected successfully!')
    
    // Run migrations
    const { execSync } = await import('child_process')
    execSync('npx prisma migrate deploy', { 
      stdio: 'inherit',
      env: { ...process.env, DATABASE_URL: config.database.DATABASE_URL }
    })
    app.log.info('✅ Database migrations completed!')
    
  } catch (error) {
    app.log.error({ error }, '❌ Database migration failed')
    // Don't exit - let the app start anyway
    app.log.warn('⚠️  Continuing without migrations...')
  }
}

// Start server
const start = async () => {
  try {
    // Run migrations first
    await runMigrations()
    
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