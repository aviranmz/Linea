import Fastify, { FastifyReply, FastifyRequest } from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import fastifyStatic from '@fastify/static'
import cookie from '@fastify/cookie'
import { PrismaClient } from '@prisma/client'
import * as crypto from 'crypto'
import * as Sentry from '@sentry/node'
import path from 'path'
import { fileURLToPath } from 'url'
import { readFileSync } from 'fs'
// import { randomUUID } from 'crypto'
import { getConfig, validateConfig } from '@linea/config'
import { sessionService } from './services/sessionService.js'
import { QRCodeGenerator } from './utils/qrGenerator.js'
import { favoritesRoutes } from './routes/favorites.js'

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
    startDate: '2025-11-15T09:00:00Z',
    endDate: '2025-11-15T17:00:00Z',
    capacity: 200,
    isPublic: true,
    featured: true,
    tags: ['design', 'innovation', 'kitchen', 'summit'],
    owner: { id: 'owner-1', name: 'Alice Wonderland', email: 'alice@kitchenco.com' },
    venue: { id: 'venue-1', name: 'Milano Design Center', address: 'Via Tortona, 37', city: 'Milano', country: 'Italy' },
    category: { id: 'cat-1', name: 'Design', slug: 'design', color: '#a855f7', icon: '🎨' },
    metadata: {
      heroImageUrl: '/images/events/kitchen-design-summit-hero.jpg'
    },
    shows: [
      {
        id: 'show-1',
        title: 'Opening Ceremony',
        description: 'Official opening of Milano Design Week 2024',
        startDate: '2025-11-15T09:00:00Z',
        endDate: '2025-11-15T10:30:00Z',
        capacity: 200
      },
      {
        id: 'show-2', 
        title: 'Keynote Presentation',
        description: 'Key insights from industry leaders',
        startDate: '2025-11-15T11:00:00Z',
        endDate: '2025-11-15T12:30:00Z',
        capacity: 150
      },
      {
        id: 'show-3',
        title: 'Panel Discussion',
        description: 'Interactive panel with experts',
        startDate: '2025-11-15T14:00:00Z',
        endDate: '2025-11-15T15:30:00Z',
        capacity: 100
      }
    ],
    _count: { waitlist: 0 }
  },
  {
    id: 'event-2',
    title: 'Smart Kitchen Technology Expo',
    slug: 'smart-kitchen-tech-expo',
    description: 'Discover the newest smart appliances and integrated technologies for modern kitchens.',
    shortDescription: 'Newest smart appliances and integrated tech.',
    status: 'PUBLISHED',
    startDate: '2025-11-20T10:00:00Z',
    endDate: '2025-11-20T18:00:00Z',
    capacity: 150,
    isPublic: true,
    featured: false,
    tags: ['technology', 'smart home', 'kitchen', 'expo'],
    owner: { id: 'owner-2', name: 'Bob The Builder', email: 'bob@designbuild.com' },
    venue: { id: 'venue-2', name: 'Triennale di Milano', address: 'Viale Emilio Alemagna, 6', city: 'Milano', country: 'Italy' },
    category: { id: 'cat-2', name: 'Technology', slug: 'technology', color: '#3b82f6', icon: '💻' },
    metadata: {
      heroImageUrl: '/images/events/smart-kitchen-tech-hero.jpg'
    },
    shows: [
      {
        id: 'show-4',
        title: 'Tech Demo',
        description: 'Live demonstration of smart kitchen technologies',
        startDate: '2025-11-20T10:00:00Z',
        endDate: '2025-11-20T11:30:00Z',
        capacity: 100
      },
      {
        id: 'show-5',
        title: 'Workshop Session',
        description: 'Hands-on learning experience',
        startDate: '2025-11-20T14:00:00Z',
        endDate: '2025-11-20T16:00:00Z',
        capacity: 50
      }
    ],
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
  max: config.environment.NODE_ENV === 'development' 
    ? Math.max(100000, Number(config.security.RATE_LIMIT_MAX_REQUESTS) || 100000)
    : config.security.RATE_LIMIT_MAX_REQUESTS,
  timeWindow: config.security.RATE_LIMIT_WINDOW_MS,
  allowList: config.environment.NODE_ENV === 'development'
    ? ['127.0.0.1','::1','::ffff:127.0.0.1','0.0.0.0']
    : []
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

// SPA routes - serve index.html for client-side routing (must be before static file serving)
app.get('/events/*', async (request, reply) => {
  reply.type('text/html')
  const indexPath = path.join(__dirname, '../../web/dist/index.html')
  const content = readFileSync(indexPath, 'utf-8')
  return reply.send(content)
})

app.get('/admin-portal', async (request, reply) => {
  reply.type('text/html')
  const indexPath = path.join(__dirname, '../../web/dist/index.html')
  const content = readFileSync(indexPath, 'utf-8')
  return reply.send(content)
})

app.get('/owner-portal', async (request, reply) => {
  reply.type('text/html')
  const indexPath = path.join(__dirname, '../../web/dist/index.html')
  const content = readFileSync(indexPath, 'utf-8')
  return reply.send(content)
})

// Serve uploaded files first (before frontend static files)
await app.register(fastifyStatic, {
  root: path.join(__dirname, '../uploads'),
  prefix: '/uploads/',
  decorateReply: false
})

// Serve static files from the frontend build (includes public directory)
await app.register(fastifyStatic, {
  root: path.join(__dirname, '../../web/dist'),
  prefix: '/',
  decorateReply: false
})

// ------------ Auth utilities ------------
const getSessionUser = async (request: FastifyRequest) => {
  const cookieName = config.security.SESSION_COOKIE_NAME || 'linea_session'
  const token = (request.cookies as Record<string, string | undefined>)?.[cookieName]
  if (!token) return null
  
  // Get session from Redis
  const sessionData = await sessionService.getSession(token)
  if (sessionData) {
    // Skip database validation in demo mode
    if (config.development.DEMO_MODE === true) {
      return {
        id: sessionData.userId,
        email: sessionData.email,
        role: sessionData.role,
        name: sessionData.name ?? null,
        isActive: true,
      } as unknown as { id: string; email: string; role: string; name?: string | null; isActive: boolean }
    }
    
    // Get user from database to ensure they're still active
    try {
      const user = await prisma.user.findFirst({
        where: { 
          id: sessionData.userId, 
          isActive: true,
          deletedAt: null 
        },
        select: { id: true, email: true, role: true, name: true, isActive: true }
      })
      if (!user) {
        await sessionService.deleteSession(token)
        return null
      }
      return user
    } catch (_e) {
      // DB unavailable in dev: treat as unauthenticated, keep session
      return {
        id: sessionData.userId,
        email: sessionData.email,
        role: sessionData.role,
        name: sessionData.name ?? null,
        isActive: true,
      } as unknown as { id: string; email: string; role: string; name?: string | null; isActive: boolean }
    }
  }
  
  // Fallback: check DB sessions (skip when using in-memory sessions)
  if (process.env.SESSION_MOCK !== 'true') {
    try {
      const dbSession = await prisma.session.findFirst({
        where: { token, expiresAt: { gt: new Date() } }
      })
      if (!dbSession) return null
      const user = await prisma.user.findFirst({
        where: { id: dbSession.userId, isActive: true, deletedAt: null },
        select: { id: true, email: true, role: true, name: true, isActive: true }
      })
      if (!user) return null
      return user
    } catch (_e) {
      // DB unavailable – act as unauthenticated
      return null
    }
  }
  
  return null
}

// Helper function to create and set session
const createSessionAndSetCookie = async (reply: FastifyReply, user: { id: string, email: string, role: string, name?: string | null }) => {
  const sessionToken = crypto.randomUUID()
  const sessionDuration = config.security.SESSION_COOKIE_MAX_AGE || 7 * 24 * 60 * 60 * 1000
  
  try {
    await sessionService.createSession(sessionToken, {
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name || null
    }, sessionDuration)
  } catch (error) {
    app.log.error({ error }, 'Failed to create session')
    throw error
  }
  
  // Only try to persist DB session if not using in-memory sessions
  if (process.env.SESSION_MOCK !== 'true') {
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
  }

  reply.setCookie(
    config.security.SESSION_COOKIE_NAME || 'linea_session',
    sessionToken,
    {
      path: '/',
      httpOnly: true,
      sameSite: (config.security.SESSION_COOKIE_SAME_SITE as 'lax'|'strict'|'none' | undefined) || 'lax',
      secure: false, // Temporarily disable secure flag for debugging
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

const getOptionalAuth = async (request: FastifyRequest) => {
  try {
    const user = await getSessionUser(request)
    return user
  } catch {
    return null
  }
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

// Get all users with magic links
app.get('/all-users-data', async (request, reply) => {
  try {
    // Get all users
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        lastLoginAt: true,
        isActive: true,
        deletedAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    // Get all email verifications
    let allEmailVerifications: any[] = []
    try {
      allEmailVerifications = await prisma.emailVerification.findMany({
        select: {
          id: true,
          email: true,
          token: true,
          expiresAt: true,
          verifiedAt: true,
          createdAt: true,
          userId: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    } catch (e) {
      app.log.warn({ error: e }, 'Failed to fetch email verifications')
    }
    
    // Create user-magic link mapping
    const usersWithMagicLinks = allUsers.map((user: any) => {
      const userVerifications = allEmailVerifications.filter(verification => 
        verification.userId === user.id
      )
      
      return {
        ...user,
        magicLinks: userVerifications.map(verification => ({
          token: verification.token,
          email: verification.email,
          expiresAt: verification.expiresAt,
          verifiedAt: verification.verifiedAt,
          createdAt: verification.createdAt,
          status: verification.verifiedAt ? 'VERIFIED' : 'PENDING'
        }))
      }
    })
    
    reply.send({
      summary: {
        totalUsers: allUsers.filter((user: any) => !user.deletedAt).length,
        totalEmailVerifications: allEmailVerifications.length
      },
      users: usersWithMagicLinks.filter((user: any) => !user.deletedAt)
    })
  } catch (error: any) {
    app.log.error({ error }, 'Failed to fetch all users data')
    reply.code(500).send({ 
      error: 'Failed to fetch all users data',
      message: error?.message,
      details: error
    })
  }
})

// Temporary admin data endpoint (remove after use)
app.get('/admin-data', async (request, reply) => {
  try {
    // Get all users first (simpler query)
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        lastLoginAt: true,
        isActive: true,
        deletedAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    // Filter admin users
    const adminUsers = allUsers.filter((user: any) => 
      user.role === 'ADMIN' && !user.deletedAt
    )
    
    // Get all email verifications
    let allEmailVerifications: any[] = []
    try {
      allEmailVerifications = await prisma.emailVerification.findMany({
        select: {
          id: true,
          email: true,
          token: true,
          expiresAt: true,
          verifiedAt: true,
          createdAt: true,
          userId: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    } catch (e) {
      app.log.warn({ error: e }, 'Failed to fetch email verifications')
    }
    
    // Create user-magic link mapping
    const usersWithMagicLinks = allUsers.map((user: any) => {
      const userVerifications = allEmailVerifications.filter(verification => 
        verification.userId === user.id
      )
      
      return {
        ...user,
        magicLinks: userVerifications.map(verification => ({
          token: verification.token,
          email: verification.email,
          expiresAt: verification.expiresAt,
          verifiedAt: verification.verifiedAt,
          createdAt: verification.createdAt,
          status: verification.verifiedAt ? 'VERIFIED' : 'PENDING'
        }))
      }
    })
    
    // Filter email verifications for admin users
    const adminUserIds = adminUsers.map((user: any) => user.id)
    const adminEmailVerifications = allEmailVerifications.filter(verification => 
      adminUserIds.includes(verification.userId)
    )
    
    const result = {
      summary: {
        totalUsers: allUsers.filter((user: any) => !user.deletedAt).length,
        adminUsers: adminUsers.length,
        totalEmailVerifications: allEmailVerifications.length,
        adminEmailVerifications: adminEmailVerifications.length
      },
      adminUsers,
      emailVerifications: adminEmailVerifications,
      allUsers: usersWithMagicLinks.filter((user: any) => !user.deletedAt)
    }
    
    reply.send(result)
  } catch (error: any) {
    app.log.error({ error }, 'Failed to fetch admin data')
    reply.code(500).send({ 
      error: 'Failed to fetch admin data',
      message: error?.message,
      details: error
    })
  }
})

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
    const { search, category, status, featured, city, owner, dateFrom, dateTo } = request.query as {
      search?: string
      category?: string
      status?: string
      featured?: string
      city?: string
      owner?: string
      dateFrom?: string
      dateTo?: string
    }

    const where: Record<string, unknown> = {
      isPublic: true,
      deletedAt: null
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { shortDescription: { contains: search, mode: 'insensitive' } },
        { owner: { name: { contains: search, mode: 'insensitive' } } },
        { owner: { businessName: { contains: search, mode: 'insensitive' } } }
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
    } else if (featured === 'false') {
      where.featured = false
    }

    if (city) {
      where.venue = { city: { contains: city, mode: 'insensitive' } }
    }

    if (owner) {
      where.owner = {
        OR: [
          { name: { contains: owner, mode: 'insensitive' } },
          { businessName: { contains: owner, mode: 'insensitive' } }
        ]
      }
    }

    if (dateFrom) {
      where.startDate = { gte: new Date(dateFrom) }
    }

    if (dateTo) {
      where.startDate = { ...(where.startDate as object || {}), lte: new Date(dateTo) }
    }

    const events = await prisma.event.findMany({
      where,
      include: {
        owner: {
          select: { id: true, name: true, email: true, businessName: true }
        },
        venue: {
          select: { id: true, name: true, address: true, city: true, country: true }
        },
        category: {
          select: { id: true, name: true, slug: true, color: true, icon: true }
        },
        shows: {
          where: { deletedAt: null },
          orderBy: { startDate: 'asc' }
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

// Get nearby events for a specific event
app.get('/api/events/:slug/nearby', async (request, reply) => {
  try {
    const { slug } = request.params as { slug: string }
    const { limit = '5' } = request.query as { limit?: string }
    
    // First get the reference event
    const referenceEvent = await prisma.event.findFirst({
      where: {
        slug,
        isPublic: true,
        deletedAt: null
      },
      include: {
        venue: true,
        owner: true
      }
    })

    if (!referenceEvent || !referenceEvent.venue) {
      reply.code(404).send({ error: 'Event not found' })
      return
    }

    // Find nearby events based on city and category
    const nearbyEvents = await prisma.event.findMany({
      where: {
        isPublic: true,
        deletedAt: null,
        id: { not: referenceEvent.id }, // Exclude the reference event
        OR: [
          // Same city
          { venue: { city: referenceEvent.venue.city } },
          // Same category
          { categoryId: referenceEvent.categoryId },
          // Same owner's area (if available)
          ...(referenceEvent.owner.areaId ? [{ owner: { areaId: referenceEvent.owner.areaId } }] : [])
        ]
      },
      include: {
        owner: {
          select: { id: true, name: true, email: true, businessName: true }
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
      take: parseInt(limit)
    })

    return { 
      referenceEvent: {
        id: referenceEvent.id,
        title: referenceEvent.title,
        slug: referenceEvent.slug,
        venue: referenceEvent.venue
      },
      nearbyEvents 
    }
  } catch (error) {
    app.log.error({ error }, 'Failed to fetch nearby events')
    reply.code(500).send({ error: 'Failed to fetch nearby events' })
  }
})

app.get('/api/events/:slug', async (request, reply) => {
  try {
  const { slug } = request.params as { slug: string }
  
    // First try to get the event (public or owned by user)
    let event = await prisma.event.findFirst({
      where: {
        slug,
        isPublic: true,
        deletedAt: null
      },
      include: {
        owner: {
          select: { id: true, name: true, email: true, businessName: true }
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

    // If not found as public event, check if user is the owner
    if (!event) {
      try {
        const user = await requireOwnerOrAdmin(request, reply)
        if (user) {
          event = await prisma.event.findFirst({
            where: {
              slug,
              ownerId: user.id,
              deletedAt: null
            },
            include: {
              owner: {
                select: { id: true, name: true, email: true, businessName: true }
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
        }
      } catch (error) {
        // User not authenticated or not owner, continue to mock
      }
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

// Get single event for owner
app.get('/api/owner/events/:eventId', async (request, reply) => {
  try {
    const user = await requireOwnerOrAdmin(request, reply)
    if (!user) return
    
    const { eventId } = request.params as { eventId: string }
    
    const event = await prisma.event.findFirst({
      where: { 
        id: eventId, 
        ownerId: user.id, 
        deletedAt: null 
      },
      include: { 
        _count: { select: { shows: true, waitlist: true } } 
      }
    })
    
    if (!event) {
      reply.code(404).send({ error: 'Event not found' })
      return
    }
    
    return { event }
  } catch (error) {
    app.log.error({ error }, 'Failed to get owner event')
    reply.code(500).send({ error: 'Failed to get event' })
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
    
    // Generate QR code for the event
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3050'
    const eventUrl = `${baseUrl}/events/${slug}`
    let generatedQRUrl = qrUrl
    
    if (!generatedQRUrl) {
      try {
        generatedQRUrl = await QRCodeGenerator.generateEventQR(eventUrl)
      } catch (error) {
        app.log.warn({ error }, 'Failed to generate QR code for event')
        // Continue without QR code if generation fails
      }
    }
    
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
          qrUrl: generatedQRUrl
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

// Photo Gallery API
app.get('/api/owner/photo-gallery', async (request, reply) => {
  try {
    const user = await requireOwnerOrAdmin(request, reply)
    if (!user) return

    const photos = await prisma.photoGallery.findMany({
      where: {
        ownerId: user.id,
        deletedAt: null
      },
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ]
    })

    reply.send({ photos })
  } catch (error) {
    request.log.error({ error }, 'Failed to fetch photo gallery')
    reply.code(500).send({ error: 'Failed to fetch photo gallery' })
  }
})

app.post('/api/owner/photo-gallery', async (request, reply) => {
  try {
    const user = await requireOwnerOrAdmin(request, reply)
    if (!user) return

    const { title, description, imageUrl, thumbnailUrl, altText, order } = request.body as {
      title: string
      description?: string
      imageUrl: string
      thumbnailUrl?: string
      altText?: string
      order?: number
    }

    const photo = await prisma.photoGallery.create({
      data: {
        title,
        description: description || null,
        imageUrl,
        thumbnailUrl: thumbnailUrl || null,
        altText: altText || null,
        order: order || 0,
        ownerId: user.id
      }
    })

    reply.send({ photo })
  } catch (error) {
    request.log.error({ error }, 'Failed to create photo')
    reply.code(500).send({ error: 'Failed to create photo' })
  }
})

app.put('/api/owner/photo-gallery/:id', async (request, reply) => {
  try {
    const user = await requireOwnerOrAdmin(request, reply)
    if (!user) return

    const { id } = request.params as { id: string }
    const { title, description, imageUrl, thumbnailUrl, altText, order, isActive } = request.body as {
      title?: string
      description?: string
      imageUrl?: string
      thumbnailUrl?: string
      altText?: string
      order?: number
      isActive?: boolean
    }

    // Check if photo exists and belongs to user
    const existing = await prisma.photoGallery.findFirst({
      where: { id, ownerId: user.id, deletedAt: null }
    })

    if (!existing) {
      reply.code(404).send({ error: 'Photo not found' })
      return
    }

    const photo = await prisma.photoGallery.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(thumbnailUrl !== undefined && { thumbnailUrl }),
        ...(altText !== undefined && { altText }),
        ...(order !== undefined && { order }),
        ...(isActive !== undefined && { isActive })
      }
    })

    reply.send({ photo })
  } catch (error) {
    request.log.error({ error }, 'Failed to update photo')
    reply.code(500).send({ error: 'Failed to update photo' })
  }
})

app.delete('/api/owner/photo-gallery/:id', async (request, reply) => {
  try {
    const user = await requireOwnerOrAdmin(request, reply)
    if (!user) return

    const { id } = request.params as { id: string }

    // Check if photo exists and belongs to user
    const existing = await prisma.photoGallery.findFirst({
      where: { id, ownerId: user.id, deletedAt: null }
    })

    if (!existing) {
      reply.code(404).send({ error: 'Photo not found' })
      return
    }

    await prisma.photoGallery.update({
      where: { id },
      data: { deletedAt: new Date() }
    })

    reply.send({ ok: true })
  } catch (error) {
    request.log.error({ error }, 'Failed to delete photo')
    reply.code(500).send({ error: 'Failed to delete photo' })
  }
})

// Public Owner Profile API (for business cards)
app.get('/api/owners/:ownerId/profile', async (request, reply) => {
  try {
    const { ownerId } = request.params as { ownerId: string }

    const owner = await prisma.user.findFirst({
      where: {
        id: ownerId,
        role: 'OWNER',
        isActive: true,
        deletedAt: null
      },
      select: {
        id: true,
        name: true,
        businessName: true,
        businessIntro: true,
        logoUrl: true,
        profilePictureUrl: true,
        website: true,
        address: true,
        city: true,
        country: true,
        facebookUrl: true,
        instagramUrl: true,
        area: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true,
            icon: true
          }
        },
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true,
            icon: true
          }
        }
      }
    })

    if (!owner) {
      reply.code(404).send({ error: 'Owner not found' })
      return
    }

    reply.send({ owner })
  } catch (error) {
    request.log.error({ error }, 'Failed to fetch owner profile')
    reply.code(500).send({ error: 'Failed to fetch owner profile' })
  }
})

// Public Photo Gallery API
app.get('/api/owners/:ownerId/photo-gallery', async (request, reply) => {
  try {
    const { ownerId } = request.params as { ownerId: string }

    const photos = await prisma.photoGallery.findMany({
      where: {
        ownerId,
        isActive: true,
        deletedAt: null
      },
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ]
    })

    reply.send({ photos })
  } catch (error) {
    request.log.error({ error }, 'Failed to fetch public photo gallery')
    reply.code(500).send({ error: 'Failed to fetch photo gallery' })
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
    const rows: string[][] = [["email","eventId","status","createdAt"], ...entries.map((e: { email: string; eventId: string; status: unknown; createdAt: Date }) => [e.email, e.eventId, String(e.status), e.createdAt.toISOString()])]
    const csv = rows.map(r => r.map(v => typeof v === 'string' && v.includes(',') ? `"${v.replace(/"/g,'""')}"` : String(v)).join(',')).join('\n')
    reply.header('Content-Type', 'text/csv')
    reply.header('Content-Disposition', `attachment; filename="waitlist-${eventId}.csv"`)
    return csv
  } catch (error) {
    const entries = mockWaitlist.filter(w => w.eventId === eventId)
    const rows: string[][] = [["email","eventId","status","createdAt"], ...entries.map((e: { email: string; eventId: string; status: unknown }) => [e.email, e.eventId, String(e.status), new Date().toISOString()])]
    const csv = rows.map(r => r.map(v => typeof v === 'string' && v.includes(',') ? `"${v.replace(/"/g,'""')}"` : String(v)).join(',')).join('\n')
    reply.header('Content-Type', 'text/csv')
    reply.header('Content-Disposition', `attachment; filename="waitlist-${eventId}.csv"`)
    return csv
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
      owners: owners.map((o: { 
        id: string; 
        email: string; 
        name: string | null; 
        isActive: boolean; 
        createdAt: Date; 
        _count: { ownedEvents: number } 
      }) => ({
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

// -------- Admin: All users list (RBAC: ADMIN only) --------
app.get('/api/admin/users', async (request, reply) => {
  const user = await requireAdmin(request, reply)
  if (!user) return
  try {
    const { page = '1', limit = '20', search, role, status, sortBy = 'createdAt', sortOrder = 'desc' } = request.query as {
      page?: string
      limit?: string
      search?: string
      role?: 'VISITOR' | 'OWNER' | 'ADMIN'
      status?: 'ACTIVE' | 'INACTIVE'
      sortBy?: string
      sortOrder?: 'asc' | 'desc'
    }
    const pageNum = Math.max(1, parseInt(page))
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)))

    const where: Record<string, unknown> = {
      deletedAt: null,
      ...(role ? { role } : {}),
      ...(status === 'ACTIVE' ? { isActive: true } : {}),
      ...(status === 'INACTIVE' ? { isActive: false } : {}),
      ...(search
        ? {
            OR: [
              { email: { contains: search, mode: 'insensitive' } },
              { name: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    }

    const [total, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          createdAt: true,
          lastLoginAt: true,
          _count: { 
            select: { 
              waitlistEntries: true,
              ownedEvents: true
            } 
          },
        },
      }),
    ])

    // Get event registrations count for each user
    const usersWithStats = await Promise.all(
      users.map(async (user: any) => {
        // Count event registrations (this would need to be implemented based on your event registration model)
        const eventRegistrations = 0 // Placeholder - you'll need to implement this based on your data model
        
        return {
          ...user,
          eventRegistrations,
          waitlistEntries: user._count.waitlistEntries,
          ownedEvents: user._count.ownedEvents,
        }
      })
    )

    reply.send({
      users: usersWithStats,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.max(1, Math.ceil(total / limitNum)),
      },
    })
  } catch (error) {
    request.log.error({ error }, 'Failed to list users (admin)')
    reply.code(500).send({ error: 'Failed to list users' })
  }
})

// -------- Admin: Update user status (RBAC: ADMIN only) --------
app.put('/api/admin/users/:id/status', async (request, reply) => {
  const user = await requireAdmin(request, reply)
  if (!user) return
  try {
    const { id } = request.params as { id: string }
    const { status } = request.body as { status: 'ACTIVE' | 'INACTIVE' }

    if (!status || !['ACTIVE', 'INACTIVE'].includes(status)) {
      reply.code(400).send({ error: 'Invalid status. Must be ACTIVE or INACTIVE' })
      return
    }

    const isActive = status === 'ACTIVE'
    
    await prisma.user.update({
      where: { id },
      data: { isActive }
    })

    reply.send({ success: true })
  } catch (error) {
    request.log.error({ error }, 'Failed to update user status (admin)')
    reply.code(500).send({ error: 'Failed to update user status' })
  }
})

// -------- Admin: Update owner details (RBAC: ADMIN only) --------
app.put('/api/admin/owners/:id', async (request, reply) => {
  const user = await requireAdmin(request, reply)
  if (!user) return
  try {
    const { id } = request.params as { id: string }
    const { name, email } = request.body as {
      name: string
      email: string
    }

    // Validate required fields
    if (!email || !name) {
      reply.code(400).send({ error: 'Email and name are required' })
      return
    }

    // Check if email is already taken by another user
    const existingUser = await prisma.user.findFirst({
      where: { email, id: { not: id }, deletedAt: null }
    })
    if (existingUser) {
      reply.code(400).send({ error: 'Email already taken by another user' })
      return
    }

    const updated = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        // Optional fields only if columns exist in DB
      },
      select: {
        id: true,
        email: true,
        name: true,
        isActive: true,
        createdAt: true,
        _count: { select: { ownedEvents: true } },
      },
    })

    reply.send({
      id: updated.id,
      email: updated.email,
      name: updated.name,
      status: updated.isActive ? 'ACTIVE' : 'SUSPENDED',
      createdAt: updated.createdAt,
      eventCount: updated._count.ownedEvents,
    })
  } catch (error) {
    request.log.error({ error }, 'Failed to update owner (admin)')
    reply.code(500).send({ error: 'Failed to update owner' })
  }
})

// -------- Admin: Toggle owner status (RBAC: ADMIN only) --------
app.put('/api/admin/owners/:id/status', async (request, reply) => {
  const user = await requireAdmin(request, reply)
  if (!user) return
  try {
    const { id } = request.params as { id: string }
    const { status } = request.body as { status: 'ACTIVE' | 'SUSPENDED' }

    if (!['ACTIVE', 'SUSPENDED'].includes(status)) {
      reply.code(400).send({ error: 'Invalid status. Must be ACTIVE or SUSPENDED' })
      return
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { isActive: status === 'ACTIVE' },
      select: {
        id: true,
        email: true,
        name: true,
        isActive: true,
        createdAt: true,
        _count: { select: { ownedEvents: true } },
      },
    })

    reply.send({
      id: updated.id,
      email: updated.email,
      name: updated.name,
      status: updated.isActive ? 'ACTIVE' : 'SUSPENDED',
      createdAt: updated.createdAt,
      eventCount: updated._count.ownedEvents,
    })
  } catch (error) {
    request.log.error({ error }, 'Failed to update owner status (admin)')
    reply.code(500).send({ error: 'Failed to update owner status' })
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
    app.log.warn({ error }, 'Theme field not found, returning null')
    reply.send({ theme: null })
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
  
  const { search, status, sortBy = 'createdAt', sortOrder = 'desc' } = request.query as { 
    search?: string; 
    status?: string; 
    sortBy?: string; 
    sortOrder?: 'asc' | 'desc' 
  }
  
  const where: any = { eventId, deletedAt: null }
  if (search) {
    where.email = { contains: search, mode: 'insensitive' }
  }
  if (status) {
    where.status = status
  }
  
  const orderBy: any = {}
  if (sortBy === 'createdAt') {
    orderBy.createdAt = sortOrder
  } else if (sortBy === 'email') {
    orderBy.email = sortOrder
  }
  
  const entries = await prisma.waitlistEntry.findMany({ 
    where, 
    orderBy,
    include: {
      user: {
        select: { id: true, name: true, businessName: true }
      }
    }
  })
  
  // Add position numbers
  const entriesWithPosition = entries.map((entry: any, index: number) => ({
    ...entry,
    position: index + 1
  }))
  
  reply.send({ entries: entriesWithPosition })
})

// Update waitlist entry status
app.post('/api/owner/events/:eventId/waitlist/:entryId', async (request, reply) => {
  const user = await requireOwnerOrAdmin(request, reply)
  if (!user) return
  const { eventId, entryId } = request.params as { eventId: string; entryId: string }
  const { status } = request.body as { status?: 'PENDING' | 'CONFIRMED' | 'CANCELLED' }
  
  // Verify event ownership
  const event = await prisma.event.findFirst({ where: { id: eventId, deletedAt: null }, select: { ownerId: true } })
  if (!event) { reply.code(404).send({ error: 'Event not found' }); return }
  if (user.role === 'OWNER' && event.ownerId !== user.id) { reply.code(403).send({ error: 'Forbidden' }); return }
  
  // Update the entry
  const updated = await prisma.waitlistEntry.update({
    where: { id: entryId },
    data: { status: status || 'CONFIRMED' }
  })
  
  reply.send({ entry: updated })
})

// Export waitlist CSV
app.get('/api/owner/events/:eventId/waitlist/export', async (request, reply) => {
  const user = await requireOwnerOrAdmin(request, reply)
  if (!user) return
  const { eventId } = request.params as { eventId: string }
  
  // Verify event ownership
  const event = await prisma.event.findFirst({ 
    where: { id: eventId, deletedAt: null }, 
    select: { ownerId: true, title: true, slug: true } 
  })
  if (!event) { reply.code(404).send({ error: 'Event not found' }); return }
  if (user.role === 'OWNER' && event.ownerId !== user.id) { reply.code(403).send({ error: 'Forbidden' }); return }
  
  // Get all waitlist entries
  const entries = await prisma.waitlistEntry.findMany({ 
    where: { eventId, deletedAt: null }, 
    orderBy: { createdAt: 'asc' },
    include: {
      user: {
        select: { name: true, businessName: true }
      }
    }
  })
  
  // Generate CSV
  const csvHeader = 'Position,Email,Name,Business Name,Status,Joined Date\n'
  const csvRows = entries.map((entry: any, index: number) => {
    const name = entry.user?.name || ''
    const businessName = entry.user?.businessName || ''
    const joinedDate = new Date(entry.createdAt).toLocaleDateString()
    return `${index + 1},"${entry.email}","${name}","${businessName}","${entry.status}","${joinedDate}"`
  }).join('\n')
  
  const csv = csvHeader + csvRows
  
  reply.header('Content-Type', 'text/csv')
  reply.header('Content-Disposition', `attachment; filename="waitlist-${event.slug}-${new Date().toISOString().split('T')[0]}.csv"`)
  reply.send(csv)
})

app.put('/api/owner/waitlist/:id', async (request, reply) => {
  const user = await requireOwnerOrAdmin(request, reply)
  if (!user) return
  const { id } = request.params as { id: string }
  const body = request.body as { status?: 'APPROVED'|'REJECTED'|'ARRIVED'|'CONFIRMED'|'CANCELLED' }
  const entry = await prisma.waitlistEntry.findUnique({ where: { id }, include: { event: true } })
  if (!entry || entry.deletedAt) { reply.code(404).send({ error: 'Not found' }); return }
  if (user.role === 'OWNER' && entry.event.ownerId !== user.id) { reply.code(403).send({ error: 'Forbidden' }); return }
  const allowedStatuses = ['APPROVED','REJECTED','ARRIVED','CONFIRMED','CANCELLED'] as const
  const nextStatus: typeof allowedStatuses[number] = body.status && (allowedStatuses as readonly string[]).includes(body.status)
    ? (body.status as typeof allowedStatuses[number])
    : 'CONFIRMED'
  const updated = await prisma.waitlistEntry.update({ where: { id }, data: { status: nextStatus as never } })
  reply.send({ entry: updated })
})

// Get all registered users across all owner's events
app.get('/api/owner/registered-users', async (request, reply) => {
  const user = await requireOwnerOrAdmin(request, reply)
  if (!user) return
  
  try {
    const { page = '1', limit = '50', search, eventId } = request.query as {
      page?: string
      limit?: string
      search?: string
      eventId?: string
    }
    const pageNum = Math.max(1, parseInt(page))
    const limitNum = Math.min(10000, Math.max(1, parseInt(limit)))

    // Get owner's events
    const ownerEvents = await prisma.event.findMany({
      where: { 
        ownerId: user.id, 
        deletedAt: null 
      },
      select: { id: true, title: true, slug: true }
    })

    if (ownerEvents.length === 0) {
      reply.send({
        users: [],
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: 0,
          totalPages: 0
        }
      })
      return
    }

    const eventIds = ownerEvents.map((event: any) => event.id)
    
    // Build where clause for waitlist entries
    const where: any = {
      eventId: { in: eventIds },
      deletedAt: null
    }
    
    if (eventId) {
      where.eventId = eventId
    }
    
    if (search) {
      where.email = { contains: search, mode: 'insensitive' }
    }

    // Get all waitlist entries first to group by user
    const allEntries = await prisma.waitlistEntry.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { 
            id: true, 
            name: true, 
            businessName: true,
            createdAt: true,
            lastLoginAt: true
          }
        },
        event: {
          select: { 
            id: true, 
            title: true, 
            slug: true,
            startDate: true
          }
        }
      }
    })

    // Group by user to get unique users with their events
    const userMap = new Map()
    
    allEntries.forEach((entry: any) => {
      const userId = entry.user?.id || entry.email
      if (!userMap.has(userId)) {
        userMap.set(userId, {
          id: entry.user?.id || null,
          email: entry.email,
          name: entry.user?.name || null,
          businessName: entry.user?.businessName || null,
          createdAt: entry.user?.createdAt || null,
          lastLoginAt: entry.user?.lastLoginAt || null,
          events: [],
          totalWaitlistEntries: 0
        })
      }
      
      const userData = userMap.get(userId)
      userData.events.push({
        eventId: entry.event.id,
        eventTitle: entry.event.title,
        eventSlug: entry.event.slug,
        eventDate: entry.event.startDate,
        status: entry.status,
        joinedAt: entry.createdAt
      })
      userData.totalWaitlistEntries++
    })

    // Convert to array and add event counts
    const allUsers = Array.from(userMap.values()).map(user => ({
      ...user,
      eventCount: user.events.length,
      uniqueEvents: [...new Set(user.events.map((e: any) => e.eventId))].length
    }))

    // Apply pagination to the grouped users
    const total = allUsers.length
    const startIndex = (pageNum - 1) * limitNum
    const endIndex = startIndex + limitNum
    const users = allUsers.slice(startIndex, endIndex)

    reply.send({
      users,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.max(1, Math.ceil(total / limitNum))
      },
      events: ownerEvents
    })
  } catch (error) {
    request.log.error({ error }, 'Failed to get registered users')
    reply.code(500).send({ error: 'Failed to get registered users' })
  }
})

// Bulk email endpoint
app.post('/api/owner/bulk-email', async (request, reply) => {
  const user = await requireOwnerOrAdmin(request, reply)
  if (!user) return
  
  try {
    const { userIds, subject, message } = request.body as {
      userIds: string[]
      subject: string
      message: string
    }

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      reply.code(400).send({ error: 'User IDs are required' })
      return
    }

    if (!subject || !message) {
      reply.code(400).send({ error: 'Subject and message are required' })
      return
    }

    // Get user emails
    const users = await prisma.user.findMany({
      where: { 
        id: { in: userIds },
        isActive: true 
      },
      select: { id: true, email: true, name: true }
    })

    if (users.length === 0) {
      reply.code(404).send({ error: 'No valid users found' })
      return
    }

    // TODO: Implement actual email sending logic here
    // For now, just log the email details
    request.log.info({
      ownerId: user.id,
      recipientCount: users.length,
      subject,
      message: message.substring(0, 100) + '...'
    }, 'Bulk email request')

    // Simulate email sending
    await new Promise(resolve => setTimeout(resolve, 1000))

    reply.send({
      success: true,
      message: `Email sent to ${users.length} users`,
      recipients: users.map((u: any) => ({ id: u.id, email: u.email, name: u.name }))
    })
  } catch (error) {
    request.log.error({ error }, 'Failed to send bulk email')
    reply.code(500).send({ error: 'Failed to send bulk email' })
  }
})

// Analytics tracking endpoints
app.post('/api/analytics/event-view', async (request, reply) => {
  try {
    const { eventId, sessionId, userAgent, referrer, country, city, deviceType, browser, os } = request.body as {
      eventId: string
      sessionId?: string
      userAgent?: string
      ipAddress?: string
      referrer?: string
      country?: string
      city?: string
      deviceType?: string
      browser?: string
      os?: string
    }

    // Get user ID if authenticated (optional for anonymous tracking)
    const user = await getOptionalAuth(request)
    const userId = user?.id || null

    // Get IP address
    const ipAddress = request.ip || request.headers['x-forwarded-for'] as string || 'unknown'

    // Create event view record
    const eventView = await prisma.eventView.create({
      data: {
        eventId,
        userId,
        sessionId: sessionId || null,
        ipAddress,
        userAgent: userAgent || null || null,
        referrer: referrer || null,
        country: country || null,
        city: city || null,
        deviceType: deviceType || null,
        browser: browser || null,
        os: os || null
      }
    })

    reply.send({ success: true, viewId: eventView.id })
  } catch (error) {
    request.log.error({ error }, 'Failed to track event view')
    reply.code(500).send({ error: 'Failed to track event view' })
  }
})

app.post('/api/analytics/event-interaction', async (request, reply) => {
  try {
    const { eventId, action, element, metadata, sessionId } = request.body as {
      eventId: string
      action: string
      element?: string
      metadata?: any
      sessionId?: string
    }

    // Get user ID if authenticated (optional for anonymous tracking)
    const user = await getOptionalAuth(request)
    const userId = user?.id || null

    // Get IP address and user agent
    const ipAddress = request.ip || request.headers['x-forwarded-for'] as string || 'unknown'
    const userAgent = request.headers['user-agent'] as string

    // Create interaction record
    const interaction = await prisma.eventInteraction.create({
      data: {
        eventId,
        userId,
        sessionId: sessionId || null,
        action,
        element: element || null,
        metadata: metadata || null,
        ipAddress,
        userAgent: userAgent || null || null
      }
    })

    reply.send({ success: true, interactionId: interaction.id })
  } catch (error) {
    request.log.error({ error }, 'Failed to track event interaction')
    reply.code(500).send({ error: 'Failed to track event interaction' })
  }
})

// Get analytics for a specific event
app.get('/api/analytics/event/:eventId', async (request, reply) => {
  const user = await requireOwnerOrAdmin(request, reply)
  if (!user) return
  
  try {
    const { eventId } = request.params as { eventId: string }
    const { period = '7d' } = request.query as { period?: string }

    request.log.info({ eventId, userId: user.id }, 'Analytics request for event')

    // Verify event ownership
    const event = await prisma.event.findFirst({
      where: { id: eventId, ownerId: user.id, deletedAt: null }
    })
    if (!event) {
      // Check if event exists but doesn't belong to user
      const eventExists = await prisma.event.findFirst({
        where: { id: eventId, deletedAt: null }
      })
      if (eventExists) {
        reply.code(403).send({ error: 'Access denied. You do not have permission to view analytics for this event.' })
        return
      } else {
        reply.code(404).send({ error: 'Event not found' })
        return
      }
    }

    // Calculate date range
    const now = new Date()
    const days = period === '1d' ? 1 : period === '7d' ? 7 : period === '30d' ? 30 : 7
    const startDate = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000))

    // Get analytics data - simplified version
    const metrics = {
      totalViews: 0,
      uniqueUsers: 0,
      totalInteractions: 0,
      topCountries: [] as Array<{ country: string | null; count: number }>,
      topDevices: [] as Array<{ device: string | null; count: number }>,
      recentViews: [] as Array<{
        id: string
        userId: string | null
        userName: string | null | undefined
        userEmail: string | undefined
        country: string | null
        deviceType: string | null
        createdAt: Date
      }>
    }

    try {
      // Try to get basic counts first
      const totalViews = await prisma.eventView.count({
        where: { eventId, createdAt: { gte: startDate } }
      })

      const totalInteractions = await prisma.eventInteraction.count({
        where: { eventId, createdAt: { gte: startDate } }
      })

      // Get unique users
      const uniqueUsersResult = await prisma.eventView.groupBy({
        by: ['ipAddress', 'userId'],
        where: { eventId, createdAt: { gte: startDate } },
        _count: { id: true }
      })

      // Get top countries
      const topCountriesResult = await prisma.eventView.groupBy({
        by: ['country'],
        where: { eventId, createdAt: { gte: startDate }, country: { not: null } },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 5
      })

      // Get top devices
      const topDevicesResult = await prisma.eventView.groupBy({
        by: ['deviceType'],
        where: { eventId, createdAt: { gte: startDate }, deviceType: { not: null } },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 5
      })

      // Get recent views
      const recentViewsResult = await prisma.eventView.findMany({
        where: { eventId, createdAt: { gte: startDate } },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: { user: { select: { name: true, email: true } } }
      })

      // Update metrics
      metrics.totalViews = totalViews
      metrics.uniqueUsers = uniqueUsersResult.length
      metrics.totalInteractions = totalInteractions
      metrics.topCountries = topCountriesResult.map((c: any) => ({ country: c.country, count: c._count.id }))
      metrics.topDevices = topDevicesResult.map((d: any) => ({ device: d.deviceType, count: d._count.id }))
      metrics.recentViews = recentViewsResult.map((v: any) => ({
        id: v.id,
        userId: v.userId,
        userName: v.user?.name,
        userEmail: v.user?.email,
        country: v.country,
        deviceType: v.deviceType,
        createdAt: v.createdAt
      }))

    } catch (dbError) {
      request.log.error({ error: dbError, eventId }, 'Database error in analytics query')
      // Continue with default values (all zeros/empty arrays)
    }

    reply.send({
      eventId,
      period,
      metrics
    })
  } catch (error) {
    request.log.error({ error }, 'Failed to get event analytics')
    reply.code(500).send({ error: 'Failed to get event analytics' })
  }
})

// Get global analytics for owner
app.get('/api/analytics/owner', async (request, reply) => {
  const user = await requireOwnerOrAdmin(request, reply)
  if (!user) return
  
  try {
    const { period = '30d' } = request.query as { period?: string }

    // Calculate date range
    const now = new Date()
    const days = period === '1d' ? 1 : period === '7d' ? 7 : period === '30d' ? 30 : 30
    const startDate = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000))

    // Get owner's events
    const ownerEvents = await prisma.event.findMany({
      where: { ownerId: user.id, deletedAt: null },
      select: { id: true, title: true, slug: true }
    })

    if (ownerEvents.length === 0) {
      reply.send({
        ownerId: user.id,
        period,
        metrics: {
          totalViews: 0,
          uniqueUsers: 0,
          totalEvents: 0,
          totalWaitlist: 0,
          totalInteractions: 0,
          topEvents: [],
          topCountries: [],
          topDevices: []
        }
      })
      return
    }

    const eventIds = ownerEvents.map((e: any) => e.id)

    // Get analytics data
    const [totalViews, uniqueUsers, totalInteractions, topEvents, topCountries, topDevices] = await Promise.all([
      // Total views across all events
      prisma.eventView.count({
        where: { eventId: { in: eventIds }, createdAt: { gte: startDate } }
      }),
      
      // Unique users
      prisma.eventView.groupBy({
        by: ['ipAddress', 'userId'],
        where: { eventId: { in: eventIds }, createdAt: { gte: startDate } },
        _count: { id: true }
      }).then((results: any) => results.length),
      
      // Total interactions
      prisma.eventInteraction.count({
        where: { eventId: { in: eventIds }, createdAt: { gte: startDate } }
      }),
      
      // Top events by views
      prisma.eventView.groupBy({
        by: ['eventId'],
        where: { eventId: { in: eventIds }, createdAt: { gte: startDate } },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 5
      }).then((results: any) => 
        results.map((r: any) => {
          const event = ownerEvents.find((e: any) => e.id === r.eventId)
          return {
            eventId: r.eventId,
            eventTitle: event?.title || 'Unknown',
            eventSlug: event?.slug || '',
            views: r._count.id
          }
        })
      ),
      
      // Top countries
      prisma.eventView.groupBy({
        by: ['country'],
        where: { eventId: { in: eventIds }, createdAt: { gte: startDate }, country: { not: null } },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 5
      }),
      
      // Top devices
      prisma.eventView.groupBy({
        by: ['deviceType'],
        where: { eventId: { in: eventIds }, createdAt: { gte: startDate }, deviceType: { not: null } },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 5
      })
    ])

    // Get total waitlist entries
    const totalWaitlist = await prisma.waitlistEntry.count({
      where: { eventId: { in: eventIds } }
    })

    reply.send({
      ownerId: user.id,
      period,
      metrics: {
        totalViews,
        uniqueUsers,
        totalEvents: ownerEvents.length,
        totalWaitlist,
        totalInteractions,
        topEvents,
        topCountries: topCountries.map((c: any) => ({ country: c.country, count: c._count.id })),
        topDevices: topDevices.map((d: any) => ({ device: d.deviceType, count: d._count.id }))
      }
    })
  } catch (error) {
    request.log.error({ error }, 'Failed to get owner analytics')
    reply.code(500).send({ error: 'Failed to get owner analytics' })
  }
})

app.put('/api/owner/theme', async (request, reply) => {
  const user = await requireOwnerOrAdmin(request, reply)
  if (!user) return
  try {
    const theme = request.body as unknown
    // Cast to any to avoid Prisma client type variance across environments
    // Update via raw SQL to avoid Prisma client JSON typing variance across environments
    const themeJson = JSON.stringify(theme ?? null)
    await prisma.$executeRawUnsafe(`UPDATE users SET theme = ${`'${themeJson.replace(/'/g, "''")}'`} WHERE id = ${`'${user.id.replace(/'/g, "''")}'`}`)
    reply.send({ ok: true, theme })
  } catch (error) {
    reply.code(500).send({ error: 'Failed to update theme' })
  }
})

// Owner Profile Management
app.get('/api/owner/profile', async (request, reply) => {
  const user = await requireOwnerOrAdmin(request, reply)
  if (!user) return
  try {
    const profile = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        name: true,
        email: true,
        phone: true,
        businessName: true,
        businessIntro: true,
        logoUrl: true,
        profilePictureUrl: true,
        website: true,
        address: true,
        city: true,
        country: true,
        latitude: true,
        longitude: true,
        areaId: true,
        area: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true,
            icon: true
          }
        },
        productId: true,
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true,
            icon: true
          }
        },
        facebookUrl: true,
        instagramUrl: true
      }
    })
    reply.send(profile)
  } catch (error) {
    request.log.error({ error }, 'Failed to fetch owner profile')
    reply.code(500).send({ error: 'Failed to fetch profile' })
  }
})

app.put('/api/owner/profile', async (request, reply) => {
  const user = await requireOwnerOrAdmin(request, reply)
  if (!user) return
  try {
    const { name, email, phone, businessName, businessIntro, website, address, city, country, latitude, longitude, areaId, productId, facebookUrl, instagramUrl } = request.body as {
      name?: string
      email?: string
      phone?: string
      businessName?: string
      businessIntro?: string
      website?: string
      address?: string
      city?: string
      country?: string
      latitude?: number
      longitude?: number
      areaId?: string
      productId?: string
      facebookUrl?: string
      instagramUrl?: string
    }

    // Validate email if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        reply.code(400).send({ error: 'Invalid email format' })
        return
      }
      
      // Check if email is already taken by another user
      const existingUser = await prisma.user.findFirst({
        where: { email, id: { not: user.id }, deletedAt: null }
      })
      if (existingUser) {
        reply.code(400).send({ error: 'Email already taken by another user' })
        return
      }
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...(name !== undefined && { name }),
        ...(email !== undefined && { email }),
        ...(phone !== undefined && { phone }),
        ...(businessName !== undefined && { businessName }),
        ...(businessIntro !== undefined && { businessIntro }),
        ...(website !== undefined && { website }),
        ...(address !== undefined && { address }),
        ...(city !== undefined && { city }),
        ...(country !== undefined && { country }),
        ...(latitude !== undefined && { latitude }),
        ...(longitude !== undefined && { longitude }),
        ...(areaId !== undefined && { areaId }),
        ...(productId !== undefined && { productId }),
        ...(facebookUrl !== undefined && { facebookUrl }),
        ...(instagramUrl !== undefined && { instagramUrl })
      },
      select: {
        name: true,
        email: true,
        phone: true,
        businessName: true,
        businessIntro: true,
        logoUrl: true,
        profilePictureUrl: true,
        website: true,
        address: true,
        city: true,
        country: true,
        latitude: true,
        longitude: true,
        areaId: true,
        area: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true,
            icon: true
          }
        },
        productId: true,
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true,
            icon: true
          }
        },
        facebookUrl: true,
        instagramUrl: true
      }
    })

    reply.send(updated)
  } catch (error) {
    request.log.error({ error }, 'Failed to update owner profile')
    reply.code(500).send({ error: 'Failed to update profile' })
  }
})

// File Upload for Owner Profile (Logo)
app.register(async function (fastify) {
  await fastify.register(import('@fastify/multipart'), {
    limits: {
      fileSize: config.storage.UPLOAD_MAX_SIZE
    }
  })

  app.post('/api/owner/upload/logo', async (request, reply) => {
    const user = await requireOwnerOrAdmin(request, reply)
    if (!user) return

    try {
      const data = await (request as any).file()
      if (!data) {
        reply.code(400).send({ error: 'No file uploaded' })
        return
      }

      // Validate file type
      const allowedTypes = config.storage.UPLOAD_ALLOWED_TYPES.split(',')
      if (!allowedTypes.includes(data.mimetype)) {
        reply.code(400).send({ error: 'Invalid file type. Allowed: ' + allowedTypes.join(', ') })
        return
      }

      // Generate unique filename
      const fileExtension = data.filename.split('.').pop() || 'jpg'
      const filename = `logo_${user.id}_${Date.now()}.${fileExtension}`
      
      // Save file to uploads directory
      const uploadPath = path.join(config.storage.UPLOAD_PATH, filename)
      const buffer = await data.toBuffer()
      
      // Ensure uploads directory exists
      const fs = await import('fs')
      const uploadDir = path.dirname(uploadPath)
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true })
      }
      
      fs.writeFileSync(uploadPath, buffer)

      // Update user profile with logo URL
      const logoUrl = `/uploads/${filename}`
      await prisma.user.update({
        where: { id: user.id },
        data: { logoUrl }
      })

      reply.send({ 
        success: true, 
        logoUrl,
        message: 'Logo uploaded successfully' 
      })
    } catch (error) {
      request.log.error({ error }, 'Failed to upload logo')
      reply.code(500).send({ error: 'Failed to upload logo' })
    }
  })

  app.post('/api/owner/upload/profile-picture', async (request, reply) => {
    const user = await requireOwnerOrAdmin(request, reply)
    if (!user) return

    try {
      const data = await (request as any).file()
      if (!data) {
        reply.code(400).send({ error: 'No file uploaded' })
        return
      }

      // Validate file type
      const allowedTypes = config.storage.UPLOAD_ALLOWED_TYPES.split(',')
      if (!allowedTypes.includes(data.mimetype)) {
        reply.code(400).send({ error: 'Invalid file type. Allowed: ' + allowedTypes.join(', ') })
        return
      }

      // Generate unique filename
      const fileExtension = data.filename.split('.').pop() || 'jpg'
      const filename = `profile_${user.id}_${Date.now()}.${fileExtension}`
      
      // Save file to uploads directory
      const uploadPath = path.join(config.storage.UPLOAD_PATH, filename)
      const buffer = await data.toBuffer()
      
      // Ensure uploads directory exists
      const fs = await import('fs')
      const uploadDir = path.dirname(uploadPath)
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true })
      }
      
      fs.writeFileSync(uploadPath, buffer)

      // Update user profile with profile picture URL
      const profilePictureUrl = `/uploads/${filename}`
      await prisma.user.update({
        where: { id: user.id },
        data: { profilePictureUrl }
      })

      reply.send({ 
        success: true, 
        profilePictureUrl,
        message: 'Profile picture uploaded successfully' 
      })
    } catch (error) {
      request.log.error({ error }, 'Failed to upload profile picture')
      reply.code(500).send({ error: 'Failed to upload profile picture' })
    }
  })
})

// Public: Designers discovery
app.get('/api/designers', async (request, reply) => {
  try {
    const { search, area, country } = request.query as {
      search?: string
      area?: string
      country?: string
    }

    const where: Record<string, unknown> = {
      role: 'OWNER',
      isActive: true,
      deletedAt: null
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { businessName: { contains: search, mode: 'insensitive' } },
        { businessIntro: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (area) {
      where.city = { contains: area, mode: 'insensitive' }
    }

    if (country) {
      where.country = { contains: country, mode: 'insensitive' }
    }

    const designers = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        businessName: true,
        businessIntro: true,
        logoUrl: true,
        profilePictureUrl: true,
        website: true,
        address: true,
        city: true,
        country: true,
        latitude: true,
        longitude: true,
        _count: {
          select: {
            ownedEvents: true
          }
        }
      },
      orderBy: [
        { businessName: 'asc' }
      ]
    })

    reply.send({ designers })
  } catch (error) {
    app.log.error({ error }, 'Failed to fetch designers')
    reply.code(500).send({ error: 'Failed to fetch designers' })
  }
})

// Public: Categories for filtering
app.get('/api/categories', async (request, reply) => {
  try {
    const categories = await prisma.category.findMany({
      where: {
        deletedAt: null
      },
      select: {
        id: true,
        name: true,
        slug: true,
        color: true,
        icon: true
      },
      orderBy: {
        name: 'asc'
      }
    })

    reply.send({ categories })
  } catch (error) {
    app.log.error({ error }, 'Failed to fetch categories')
    reply.code(500).send({ error: 'Failed to fetch categories' })
  }
})

// Public: Areas for filtering
app.get('/api/areas', async (request, reply) => {
  try {
    const areas = await prisma.area.findMany({
      where: {
        deletedAt: null
      },
      select: {
        id: true,
        name: true,
        slug: true,
        color: true,
        icon: true
      },
      orderBy: {
        name: 'asc'
      }
    })

    reply.send({ areas })
  } catch (error) {
    app.log.warn({ error }, 'Areas table not found, returning empty array')
    reply.send({ areas: [] })
  }
})

// Public: Products for filtering
app.get('/api/products', async (request, reply) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        deletedAt: null
      },
      select: {
        id: true,
        name: true,
        slug: true,
        color: true,
        icon: true
      },
      orderBy: {
        name: 'asc'
      }
    })

    reply.send({ products })
  } catch (error) {
    app.log.warn({ error }, 'Products table not found, returning empty array')
    reply.send({ products: [] })
  }
})

// Admin: Categories management
app.get('/api/admin/categories', async (request, reply) => {
  const user = await requireAdmin(request, reply)
  if (!user) return

  try {
    const categories = await prisma.category.findMany({
      where: {
        deletedAt: null
      },
      orderBy: {
        name: 'asc'
      }
    })

    reply.send({ categories })
  } catch (error) {
    app.log.error({ error }, 'Failed to fetch categories')
    reply.code(500).send({ error: 'Failed to fetch categories' })
  }
})

app.post('/api/admin/categories', async (request, reply) => {
  const user = await requireAdmin(request, reply)
  if (!user) return

  try {
    const { name, slug, description, color, icon, isActive } = request.body as {
      name: string
      slug: string
      description?: string
      color?: string
      icon?: string
      isActive?: boolean
    }

    // Check if slug already exists
    const existingCategory = await prisma.category.findFirst({
      where: { slug, deletedAt: null }
    })

    if (existingCategory) {
      reply.code(409).send({ error: 'Category with this slug already exists' })
      return
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description: description || null,
        color: color || '#3b82f6',
        icon: icon || '🏷️',
        isActive: isActive !== false
      }
    })

    reply.send({ category })
  } catch (error) {
    app.log.error({ error }, 'Failed to create category')
    reply.code(500).send({ error: 'Failed to create category' })
  }
})

app.put('/api/admin/categories/:id', async (request, reply) => {
  const user = await requireAdmin(request, reply)
  if (!user) return

  try {
    const { id } = request.params as { id: string }
    const { name, slug, description, color, icon, isActive } = request.body as {
      name: string
      slug: string
      description?: string
      color?: string
      icon?: string
      isActive?: boolean
    }

    // Check if slug already exists (excluding current category)
    const existingCategory = await prisma.category.findFirst({
      where: { 
        slug, 
        deletedAt: null,
        id: { not: id }
      }
    })

    if (existingCategory) {
      reply.code(409).send({ error: 'Category with this slug already exists' })
      return
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(slug !== undefined && { slug }),
        ...(description !== undefined && { description: description || null }),
        ...(color !== undefined && { color }),
        ...(icon !== undefined && { icon }),
        ...(isActive !== undefined && { isActive })
      }
    })

    reply.send({ category })
  } catch (error) {
    app.log.error({ error }, 'Failed to update category')
    reply.code(500).send({ error: 'Failed to update category' })
  }
})

app.delete('/api/admin/categories/:id', async (request, reply) => {
  const user = await requireAdmin(request, reply)
  if (!user) return

  try {
    const { id } = request.params as { id: string }

    // Soft delete
    await prisma.category.update({
      where: { id },
      data: { deletedAt: new Date() }
    })

    reply.send({ success: true })
  } catch (error) {
    app.log.error({ error }, 'Failed to delete category')
    reply.code(500).send({ error: 'Failed to delete category' })
  }
})

// Admin: Areas management
app.get('/api/admin/areas', async (request, reply) => {
  const user = await requireAdmin(request, reply)
  if (!user) return

  try {
    const areas = await prisma.area.findMany({
      where: {
        deletedAt: null
      },
      orderBy: {
        name: 'asc'
      }
    })

    reply.send({ areas })
  } catch (error) {
    app.log.error({ error }, 'Failed to fetch areas')
    reply.code(500).send({ error: 'Failed to fetch areas' })
  }
})

app.post('/api/admin/areas', async (request, reply) => {
  const user = await requireAdmin(request, reply)
  if (!user) return

  try {
    const { name, slug, description, color, icon, isActive } = request.body as {
      name: string
      slug: string
      description?: string
      color?: string
      icon?: string
      isActive?: boolean
    }

    // Check if slug already exists
    const existingArea = await prisma.area.findFirst({
      where: { slug, deletedAt: null }
    })

    if (existingArea) {
      reply.code(409).send({ error: 'Area with this slug already exists' })
      return
    }

    const area = await prisma.area.create({
      data: {
        name,
        slug,
        description: description || null,
        color: color || '#3b82f6',
        icon: icon || '📍',
        isActive: isActive !== false
      }
    })

    reply.send({ area })
  } catch (error) {
    app.log.error({ error }, 'Failed to create area')
    reply.code(500).send({ error: 'Failed to create area' })
  }
})

app.put('/api/admin/areas/:id', async (request, reply) => {
  const user = await requireAdmin(request, reply)
  if (!user) return

  try {
    const { id } = request.params as { id: string }
    const { name, slug, description, color, icon, isActive } = request.body as {
      name: string
      slug: string
      description?: string
      color?: string
      icon?: string
      isActive?: boolean
    }

    // Check if slug already exists (excluding current area)
    const existingArea = await prisma.area.findFirst({
      where: { 
        slug, 
        deletedAt: null,
        id: { not: id }
      }
    })

    if (existingArea) {
      reply.code(409).send({ error: 'Area with this slug already exists' })
      return
    }

    const area = await prisma.area.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(slug !== undefined && { slug }),
        ...(description !== undefined && { description: description || null }),
        ...(color !== undefined && { color }),
        ...(icon !== undefined && { icon }),
        ...(isActive !== undefined && { isActive })
      }
    })

    reply.send({ area })
  } catch (error) {
    app.log.error({ error }, 'Failed to update area')
    reply.code(500).send({ error: 'Failed to update area' })
  }
})

app.delete('/api/admin/areas/:id', async (request, reply) => {
  const user = await requireAdmin(request, reply)
  if (!user) return

  try {
    const { id } = request.params as { id: string }

    // Soft delete
    await prisma.area.update({
      where: { id },
      data: { deletedAt: new Date() }
    })

    reply.send({ success: true })
  } catch (error) {
    app.log.error({ error }, 'Failed to delete area')
    reply.code(500).send({ error: 'Failed to delete area' })
  }
})

// Admin: Products management
app.get('/api/admin/products', async (request, reply) => {
  const user = await requireAdmin(request, reply)
  if (!user) return

  try {
    const products = await prisma.product.findMany({
      where: {
        deletedAt: null
      },
      orderBy: {
        name: 'asc'
      }
    })

    reply.send({ products })
  } catch (error) {
    app.log.warn({ error }, 'Products table not found, returning empty array')
    reply.send({ products: [] })
  }
})

app.post('/api/admin/products', async (request, reply) => {
  const user = await requireAdmin(request, reply)
  if (!user) return

  try {
    const { name, slug, description, color, icon, isActive } = request.body as {
      name: string
      slug: string
      description?: string
      color?: string
      icon?: string
      isActive?: boolean
    }

    // Check if slug already exists
    const existingProduct = await prisma.product.findFirst({
      where: { slug, deletedAt: null }
    })

    if (existingProduct) {
      reply.code(409).send({ error: 'Product with this slug already exists' })
      return
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description: description || null,
        color: color || '#3b82f6',
        icon: icon || '🏷️',
        isActive: isActive !== false
      }
    })

    reply.send({ product })
  } catch (error) {
    app.log.error({ error }, 'Failed to create product')
    reply.code(500).send({ error: 'Failed to create product' })
  }
})

app.put('/api/admin/products/:id', async (request, reply) => {
  const user = await requireAdmin(request, reply)
  if (!user) return

  try {
    const { id } = request.params as { id: string }
    const { name, slug, description, color, icon, isActive } = request.body as {
      name: string
      slug: string
      description?: string
      color?: string
      icon?: string
      isActive?: boolean
    }

    // Check if slug already exists (excluding current product)
    const existingProduct = await prisma.product.findFirst({
      where: { 
        slug, 
        deletedAt: null,
        id: { not: id }
      }
    })

    if (existingProduct) {
      reply.code(409).send({ error: 'Product with this slug already exists' })
      return
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(slug !== undefined && { slug }),
        ...(description !== undefined && { description: description || null }),
        ...(color !== undefined && { color }),
        ...(icon !== undefined && { icon }),
        ...(isActive !== undefined && { isActive })
      }
    })

    reply.send({ product })
  } catch (error) {
    app.log.error({ error }, 'Failed to update product')
    reply.code(500).send({ error: 'Failed to update product' })
  }
})

app.delete('/api/admin/products/:id', async (request, reply) => {
  const user = await requireAdmin(request, reply)
  if (!user) return

  try {
    const { id } = request.params as { id: string }

    // Soft delete
    await prisma.product.update({
      where: { id },
      data: { deletedAt: new Date() }
    })

    reply.send({ success: true })
  } catch (error) {
    app.log.error({ error }, 'Failed to delete product')
    reply.code(500).send({ error: 'Failed to delete product' })
  }
})

// (Removed duplicate dev login route) - using single definition near the bottom

// Auth: Request magic link (ENHANCED WITH SECURITY & RATE LIMITING)
app.post('/auth/request-magic-link', async (request, reply) => {
  const { email } = request.body as { email: string }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email || !emailRegex.test(email)) {
    reply.code(400).send({ error: 'Invalid email format' })
    return
  }

  // Rate limiting: Check for recent requests from this IP
  const clientIP = request.ip
  const recentRequests = await prisma.emailVerification.count({
    where: {
      email,
      type: 'MAGIC_LINK',
      createdAt: {
        gte: new Date(Date.now() - 1000 * 60 * 5) // Last 5 minutes
      }
    }
  })

  if (recentRequests >= 3) {
    reply.code(429).send({ 
      error: 'Too many requests. Please wait 5 minutes before requesting another magic link.',
      retryAfter: 300
    })
    return
  }

  // Invalidate any existing unexpired tokens for this email
  await prisma.emailVerification.updateMany({
    where: {
      email,
      type: 'MAGIC_LINK',
      verifiedAt: null,
      expiresAt: { gt: new Date() }
    },
    data: {
      expiresAt: new Date() // Invalidate existing tokens
    }
  })

  const token = crypto.randomUUID()
  const expiresAt = new Date(Date.now() + 1000 * 60 * 15) // 15 minutes

  try {
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

    // Log the request for security monitoring
    app.log.info({ 
      email, 
      ip: clientIP,
      userAgent: request.headers['user-agent'],
      callbackUrl: callbackUrl.toString() 
    }, 'Magic link requested')

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
      reply.send({ 
        ok: true, 
        message: 'Magic link sent to your email',
        expiresIn: '15 minutes'
      })
    }
  } catch (error) {
    app.log.error({ error, email }, 'Failed to create magic link')
    reply.code(500).send({ error: 'Failed to generate magic link. Please try again.' })
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
    where: { email },
    select: { id: true, role: true }
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

// Auth: Magic link callback (ENHANCED WITH SECURITY & AUDIT LOGGING)
app.get('/auth/callback', async (request, reply) => {
  const { token } = request.query as { token?: string }
  if (!token) {
    reply.code(400).send({ error: 'Missing token' })
    return
  }

  const clientIP = request.ip
  const userAgent = request.headers['user-agent']

  try {
    const record = await prisma.emailVerification.findFirst({
      where: {
        token,
        type: 'MAGIC_LINK',
        verifiedAt: null,
        expiresAt: { gt: new Date() },
      }
    })

    if (!record) {
      app.log.warn({ 
        token: token.substring(0, 8) + '...', 
        ip: clientIP,
        userAgent 
      }, 'Invalid or expired magic link attempt')
      reply.code(400).send({ error: 'Invalid or expired token' })
      return
    }

    // Upsert user
    const user = await prisma.user.upsert({
      where: { email: record.email },
      update: { 
        lastLoginAt: new Date(), 
        isActive: true 
      },
      create: { 
        email: record.email, 
        role: 'VISITOR', 
        isActive: true, 
        lastLoginAt: new Date() 
      }
    })

    // Mark verification used
    await prisma.emailVerification.update({
      where: { id: record.id },
      data: { 
        verifiedAt: new Date(), 
        userId: user.id 
      }
    })

    // Log successful login for audit trail
    await prisma.userActivity.create({
      data: {
        userId: user.id,
        action: 'LOGIN',
        description: 'User logged in via magic link',
        metadata: {
          loginMethod: 'magic_link',
          ipAddress: clientIP,
          userAgent: userAgent || null,
          tokenId: record.id
        },
        ipAddress: clientIP,
        userAgent: userAgent || null
      }
    })

    // Create session (Redis)
    await createSessionAndSetCookie(reply, {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name || null
    })

    app.log.info({ 
      userId: user.id, 
      email: user.email,
      ip: clientIP 
    }, 'User successfully logged in via magic link')

    // Redirect to frontend
    reply.redirect(config.server.FRONTEND_URL || '/')
  } catch (error) {
    app.log.error({ 
      error, 
      token: token.substring(0, 8) + '...',
      ip: clientIP 
    }, 'Failed to process magic link callback')
    reply.code(500).send({ error: 'Authentication failed. Please try again.' })
  }
})

// Auth: Logout
app.post('/auth/logout', async (request, reply) => {
  try {
    const cookieName = config.security.SESSION_COOKIE_NAME || 'linea_session'
    const token = (request.cookies as Record<string, string | undefined>)?.[cookieName]
    
    if (token) {
      // Get user before clearing session for audit logging
      const user = await getSessionUser(request)
      
      // Clear session from Redis
      await sessionService.deleteSession(token)
      
      // Log logout for audit trail
      if (user) {
        await prisma.userActivity.create({
          data: {
            userId: user.id,
            action: 'LOGOUT',
            description: 'User logged out',
            metadata: {
              logoutMethod: 'manual',
              ipAddress: request.ip,
              userAgent: request.headers['user-agent'] || null || null
            },
            ipAddress: request.ip,
            userAgent: request.headers['user-agent'] || null || null
          }
        })
        
        app.log.info({ 
          userId: user.id, 
          email: user.email,
          ip: request.ip 
        }, 'User logged out')
      }
    }
    
    // Clear session cookie
    reply.clearCookie(cookieName, {
      path: '/',
      httpOnly: true,
      secure: config.security.SESSION_COOKIE_SECURE,
      sameSite: config.security.SESSION_COOKIE_SAME_SITE as 'strict' | 'lax' | 'none'
    })
    
    reply.send({ ok: true, message: 'Logged out successfully' })
  } catch (error) {
    app.log.error({ error }, 'Failed to logout user')
    reply.code(500).send({ error: 'Failed to logout' })
  }
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

// User Profile Management (for all authenticated users)
app.get('/api/user/profile', async (request, reply) => {
  const user = await getSessionUser(request)
  if (!user) {
    reply.code(401).send({ error: 'Authentication required' })
    return
  }
  
  try {
    const profile = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
        lastLoginAt: true,
        // Include business fields for owners
        businessName: true,
        businessIntro: true,
        logoUrl: true,
        profilePictureUrl: true,
        website: true,
        address: true,
        city: true,
        country: true,
        latitude: true,
        longitude: true,
        areaId: true,
        area: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true,
            icon: true
          }
        },
        productId: true,
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true,
            icon: true
          }
        },
        facebookUrl: true,
        instagramUrl: true
      }
    })
    
    if (!profile) {
      reply.code(404).send({ error: 'User profile not found' })
      return
    }
    
    reply.send(profile)
  } catch (error) {
    request.log.error({ error }, 'Failed to fetch user profile')
    reply.code(500).send({ error: 'Failed to fetch profile' })
  }
})

app.put('/api/user/profile', async (request, reply) => {
  const user = await getSessionUser(request)
  if (!user) {
    reply.code(401).send({ error: 'Authentication required' })
    return
  }
  
  try {
    const { 
      name, 
      email, 
      phone, 
      businessName, 
      businessIntro, 
      website, 
      address, 
      city, 
      country, 
      latitude, 
      longitude, 
      areaId, 
      productId, 
      facebookUrl, 
      instagramUrl 
    } = request.body as {
      name?: string
      email?: string
      phone?: string
      businessName?: string
      businessIntro?: string
      website?: string
      address?: string
      city?: string
      country?: string
      latitude?: number
      longitude?: number
      areaId?: string
      productId?: string
      facebookUrl?: string
      instagramUrl?: string
    }

    // Validate email if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        reply.code(400).send({ error: 'Invalid email format' })
        return
      }
      
      // Check if email is already taken by another user
      const existingUser = await prisma.user.findFirst({
        where: { email, id: { not: user.id }, deletedAt: null }
      })
      if (existingUser) {
        reply.code(400).send({ error: 'Email already taken by another user' })
        return
      }
    }

    // Validate area and product if provided
    if (areaId) {
      const area = await prisma.area.findUnique({ where: { id: areaId } })
      if (!area) {
        reply.code(400).send({ error: 'Invalid area ID' })
        return
      }
    }

    if (productId) {
      const product = await prisma.product.findUnique({ where: { id: productId } })
      if (!product) {
        reply.code(400).send({ error: 'Invalid product ID' })
        return
      }
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...(name !== undefined && { name }),
        ...(email !== undefined && { email }),
        ...(phone !== undefined && { phone }),
        ...(businessName !== undefined && { businessName }),
        ...(businessIntro !== undefined && { businessIntro }),
        ...(website !== undefined && { website }),
        ...(address !== undefined && { address }),
        ...(city !== undefined && { city }),
        ...(country !== undefined && { country }),
        ...(latitude !== undefined && { latitude }),
        ...(longitude !== undefined && { longitude }),
        ...(areaId !== undefined && { areaId }),
        ...(productId !== undefined && { productId }),
        ...(facebookUrl !== undefined && { facebookUrl }),
        ...(instagramUrl !== undefined && { instagramUrl })
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        businessName: true,
        businessIntro: true,
        logoUrl: true,
        profilePictureUrl: true,
        website: true,
        address: true,
        city: true,
        country: true,
        latitude: true,
        longitude: true,
        areaId: true,
        area: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true,
            icon: true
          }
        },
        productId: true,
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true,
            icon: true
          }
        },
        facebookUrl: true,
        instagramUrl: true
      }
    })

    reply.send(updated)
  } catch (error) {
    request.log.error({ error }, 'Failed to update user profile')
    reply.code(500).send({ error: 'Failed to update profile' })
  }
})

// User Profile Picture Upload
app.post('/api/user/upload/profile-picture', async (request, reply) => {
  const user = await getSessionUser(request)
  if (!user) {
    reply.code(401).send({ error: 'Authentication required' })
    return
  }

  try {
    const data = await (request as any).file()
    if (!data) {
      reply.code(400).send({ error: 'No file uploaded' })
      return
    }

    // Validate file type
    const allowedTypes = config.storage.UPLOAD_ALLOWED_TYPES.split(',')
    if (!allowedTypes.includes(data.mimetype)) {
      reply.code(400).send({ error: 'Invalid file type. Allowed: ' + allowedTypes.join(', ') })
      return
    }

    // Generate unique filename
    const fileExtension = data.filename.split('.').pop() || 'jpg'
    const filename = `profile_${user.id}_${Date.now()}.${fileExtension}`
    
    // Save file to uploads directory
    const uploadPath = path.join(config.storage.UPLOAD_PATH, filename)
    const buffer = await data.toBuffer()
    
    // Ensure uploads directory exists
    const fs = await import('fs')
    const uploadDir = path.dirname(uploadPath)
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    
    fs.writeFileSync(uploadPath, buffer)

    // Update user profile with profile picture URL
    const profilePictureUrl = `/uploads/${filename}`
    await prisma.user.update({
      where: { id: user.id },
      data: { profilePictureUrl }
    })

    reply.send({ 
      success: true, 
      profilePictureUrl,
      message: 'Profile picture uploaded successfully' 
    })
  } catch (error) {
    request.log.error({ error }, 'Failed to upload profile picture')
    reply.code(500).send({ error: 'Failed to upload profile picture' })
  }
})

// User Account Settings
app.get('/api/user/settings', async (request, reply) => {
  const user = await getSessionUser(request)
  if (!user) {
    reply.code(401).send({ error: 'Authentication required' })
    return
  }
  
  try {
    const settings = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        lastLoginAt: true
      }
    })
    
    reply.send(settings)
  } catch (error) {
    request.log.error({ error }, 'Failed to fetch user settings')
    reply.code(500).send({ error: 'Failed to fetch settings' })
  }
})

// User Activity Log (audit trail)
app.get('/api/user/activity', async (request, reply) => {
  const user = await getSessionUser(request)
  if (!user) {
    reply.code(401).send({ error: 'Authentication required' })
    return
  }
  
  try {
    const { page = 1, limit = 20 } = request.query as { page?: number; limit?: number }
    const pageNum = Number(page)
    const limitNum = Number(limit)

    // Get user's recent activity (login history, profile updates, etc.)
    const activities = await prisma.userActivity.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      skip: (pageNum - 1) * limitNum,
      take: limitNum,
      select: {
        id: true,
        action: true,
        description: true,
        metadata: true,
        createdAt: true,
        ipAddress: true,
        userAgent: true
      }
    })

    const total = await prisma.userActivity.count({
      where: { userId: user.id }
    })

    reply.send({
      activities,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    })
  } catch (error) {
    request.log.error({ error }, 'Failed to fetch user activity')
    reply.code(500).send({ error: 'Failed to fetch activity log' })
  }
})

// Follow/Unfollow System
app.post('/api/follow/:userId', async (request, reply) => {
  const user = await getSessionUser(request)
  if (!user) {
    reply.code(401).send({ error: 'Authentication required' })
    return
  }
  
  try {
    const { userId } = request.params as { userId: string }
    
    // Prevent self-following
    if (userId === user.id) {
      reply.code(400).send({ error: 'Cannot follow yourself' })
      return
    }
    
    // Check if user exists and is active
    const targetUser = await prisma.user.findFirst({
      where: { id: userId, isActive: true, deletedAt: null },
      select: { id: true, name: true, email: true, role: true }
    })
    
    if (!targetUser) {
      reply.code(404).send({ error: 'User not found' })
      return
    }
    
    // Check if already following
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: user.id,
          followingId: userId
        }
      }
    })
    
    if (existingFollow) {
      reply.code(400).send({ error: 'Already following this user' })
      return
    }
    
    // Create follow relationship
    const follow = await prisma.follow.create({
      data: {
        followerId: user.id,
        followingId: userId
      }
    })
    
    // Log the follow action
    await prisma.userActivity.create({
      data: {
        userId: user.id,
        action: 'FOLLOW_USER',
        description: `Started following ${targetUser.name || targetUser.email}`,
        metadata: {
          targetUserId: userId,
          targetUserName: targetUser.name,
          targetUserEmail: targetUser.email
        },
        ipAddress: request.ip,
        userAgent: request.headers['user-agent'] || null
      }
    })
    
    reply.send({ 
      success: true, 
      message: `Now following ${targetUser.name || targetUser.email}`,
      follow 
    })
  } catch (error) {
    request.log.error({ error }, 'Failed to follow user')
    reply.code(500).send({ error: 'Failed to follow user' })
  }
})

app.delete('/api/follow/:userId', async (request, reply) => {
  const user = await getSessionUser(request)
  if (!user) {
    reply.code(401).send({ error: 'Authentication required' })
    return
  }
  
  try {
    const { userId } = request.params as { userId: string }
    
    // Check if following this user
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: user.id,
          followingId: userId
        }
      },
      include: {
        following: {
          select: { name: true, email: true }
        }
      }
    })
    
    if (!existingFollow) {
      reply.code(404).send({ error: 'Not following this user' })
      return
    }
    
    // Remove follow relationship
    await prisma.follow.delete({
      where: { id: existingFollow.id }
    })
    
    // Log the unfollow action
    await prisma.userActivity.create({
      data: {
        userId: user.id,
        action: 'UNFOLLOW_USER',
        description: `Stopped following ${existingFollow.following.name || existingFollow.following.email}`,
        metadata: {
          targetUserId: userId,
          targetUserName: existingFollow.following.name,
          targetUserEmail: existingFollow.following.email
        },
        ipAddress: request.ip,
        userAgent: request.headers['user-agent'] || null
      }
    })
    
    reply.send({ 
      success: true, 
      message: `Stopped following ${existingFollow.following.name || existingFollow.following.email}`
    })
  } catch (error) {
    request.log.error({ error }, 'Failed to unfollow user')
    reply.code(500).send({ error: 'Failed to unfollow user' })
  }
})

app.get('/api/follow/:userId', async (request, reply) => {
  const user = await getSessionUser(request)
  if (!user) {
    reply.code(401).send({ error: 'Authentication required' })
    return
  }
  
  try {
    const { userId } = request.params as { userId: string }
    
    const isFollowing = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: user.id,
          followingId: userId
        }
      }
    })
    
    reply.send({ isFollowing: !!isFollowing })
  } catch (error) {
    request.log.error({ error }, 'Failed to check follow status')
    reply.code(500).send({ error: 'Failed to check follow status' })
  }
})

// Get user's follows (people they follow)
app.get('/api/user/follows', async (request, reply) => {
  const user = await getSessionUser(request)
  if (!user) {
    reply.code(401).send({ error: 'Authentication required' })
    return
  }
  
  try {
    const { page = 1, limit = 20 } = request.query as { page?: number; limit?: number }
    const pageNum = Number(page)
    const limitNum = Number(limit)

    const [total, follows] = await Promise.all([
      prisma.follow.count({ where: { followerId: user.id } }),
      prisma.follow.findMany({
        where: { followerId: user.id },
        include: {
          following: {
            select: {
              id: true,
              name: true,
              email: true,
              businessName: true,
              profilePictureUrl: true,
              role: true,
              area: {
                select: { name: true, color: true, icon: true }
              },
              product: {
                select: { name: true, color: true, icon: true }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (pageNum - 1) * limitNum,
        take: limitNum
      })
    ])

    reply.send({
      follows: follows.map((f: any) => ({
        id: f.id,
        user: f.following,
        followedAt: f.createdAt
      })),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    })
  } catch (error) {
    request.log.error({ error }, 'Failed to fetch user follows')
    reply.code(500).send({ error: 'Failed to fetch follows' })
  }
})

// Get user's followers (people following them)
app.get('/api/user/followers', async (request, reply) => {
  const user = await getSessionUser(request)
  if (!user) {
    reply.code(401).send({ error: 'Authentication required' })
    return
  }
  
  try {
    const { page = 1, limit = 20 } = request.query as { page?: number; limit?: number }
    const pageNum = Number(page)
    const limitNum = Number(limit)

    const [total, followers] = await Promise.all([
      prisma.follow.count({ where: { followingId: user.id } }),
      prisma.follow.findMany({
        where: { followingId: user.id },
        include: {
          follower: {
            select: {
              id: true,
              name: true,
              email: true,
              businessName: true,
              profilePictureUrl: true,
              role: true,
              area: {
                select: { name: true, color: true, icon: true }
              },
              product: {
                select: { name: true, color: true, icon: true }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (pageNum - 1) * limitNum,
        take: limitNum
      })
    ])

    reply.send({
      followers: followers.map((f: any) => ({
        id: f.id,
        user: f.follower,
        followedAt: f.createdAt
      })),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    })
  } catch (error) {
    request.log.error({ error }, 'Failed to fetch user followers')
    reply.code(500).send({ error: 'Failed to fetch followers' })
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
  // Try to upsert the user, but tolerate DB issues in dev
  let user: { id: string; email: string; role: 'OWNER'|'ADMIN'|'VISITOR'; name?: string | null }
  try {
    user = await prisma.user.upsert({
      where: { email },
      update: { role, name: name ?? null, isActive: true, lastLoginAt: new Date() },
      create: { email, role, name: name ?? null, isActive: true, lastLoginAt: new Date() }
    }) as unknown as { id: string; email: string; role: 'OWNER'|'ADMIN'|'VISITOR'; name?: string | null }
  } catch (e) {
    app.log.warn({ e }, 'Dev generate-link: DB unavailable, using in-memory user')
    user = { id: crypto.randomUUID(), email, role, name: name ?? null }
  }

  // Create a non-expiring verification record (best-effort)
  const token = crypto.randomUUID()
  try {
    await prisma.emailVerification.create({
      data: { email, token, type: 'MAGIC_LINK', expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 10) }
    })
  } catch (e) {
    app.log.warn({ e }, 'Dev generate-link: failed to persist email verification, continuing')
  }

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
  let user: { id: string; email: string; role: 'VISITOR'|'OWNER'|'ADMIN'; name?: string | null }
  try {
    user = await prisma.user.upsert({
      where: { email },
      update: { role: desiredRole, name: name ?? null, isActive: true, lastLoginAt: new Date() },
      create: { email, role: desiredRole, name: name ?? null, isActive: true, lastLoginAt: new Date() }
    }) as unknown as { id: string; email: string; role: 'VISITOR'|'OWNER'|'ADMIN'; name?: string | null }
  } catch (e) {
    app.log.warn({ e }, 'Dev login: DB unavailable, using in-memory user')
    user = { id: crypto.randomUUID(), email, role: desiredRole, name: name ?? null }
  }

  await createSessionAndSetCookie(reply, { id: user.id, email: user.email, role: user.role, name: user.name || null })
  reply.send({ ok: true, user: { id: user.id, email: user.email, role: user.role, name: user.name } })
})

// Dev-only: reusable login link that creates a session and redirects
app.get('/auth/dev/login-link', async (request, reply) => {
  const { email, role, name, redirect } = request.query as { email?: string; role?: 'VISITOR'|'OWNER'|'ADMIN'; name?: string; redirect?: string }
  
  // Check if dev login is allowed
  const isDevMode = config.environment.NODE_ENV !== 'production'
  const isDemoMode = config.development.DEMO_MODE === true
  
  // Define allowed demo users when DEMO_MODE is enabled
  const allowedDemoUsers = [
    'admin@example.com',
    'owner1@example.com', 
    'owner2@example.com'
  ]
  
  // Check if access is allowed
  if (!isDevMode && !isDemoMode) {
    reply.code(403).send({ error: 'Forbidden' })
    return
  }
  
  // In demo mode, only allow specific users
  if (isDemoMode && email && !allowedDemoUsers.includes(email)) {
    reply.code(403).send({ error: 'Demo mode: Only specific users allowed' })
    return
  }
  
  // In non-demo dev mode, require magic link flag
  if (isDevMode && !isDemoMode && !shouldShowMagicLink) {
    reply.code(403).send({ error: 'Forbidden' })
    return
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email || !emailRegex.test(email)) { 
    reply.code(400).send({ error: 'Invalid email' })
    return 
  }
  
  const desiredRole = (role || 'VISITOR')
  let user: { id: string; email: string; role: 'VISITOR'|'OWNER'|'ADMIN'; name?: string | null }
  
  try {
    // First try to find existing user
    const existingUser = await prisma.user.findFirst({
      where: { email, isActive: true, deletedAt: null },
      select: { id: true, email: true, role: true, name: true }
    })
    
    if (existingUser) {
      // Update existing user
      user = await prisma.user.update({
        where: { id: existingUser.id },
        data: { role: desiredRole, name: name ?? null, lastLoginAt: new Date() },
        select: { id: true, email: true, role: true, name: true }
      }) as unknown as { id: string; email: string; role: 'VISITOR'|'OWNER'|'ADMIN'; name?: string | null }
      app.log.info({ userId: user.id, email: user.email }, 'Dev login-link: Existing user updated')
    } else {
      // Create new user
      user = await prisma.user.create({
        data: { email, role: desiredRole, name: name ?? null, isActive: true, lastLoginAt: new Date() },
        select: { id: true, email: true, role: true, name: true }
      }) as unknown as { id: string; email: string; role: 'VISITOR'|'OWNER'|'ADMIN'; name?: string | null }
      app.log.info({ userId: user.id, email: user.email }, 'Dev login-link: New user created')
    }
  } catch (e) {
    app.log.error({ e, email }, 'Dev login-link: DB operation failed, using in-memory user')
    user = { id: crypto.randomUUID(), email, role: desiredRole, name: name ?? null }
  }

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
  // Only serve index.html for non-API routes, but exclude uploads
  if (!_request.url.startsWith('/api') && !_request.url.startsWith('/docs') && !_request.url.startsWith('/health') && !_request.url.startsWith('/uploads')) {
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

// Development-only demo data seeding
/*
const _seedDemoData = async () => {
  if (config.environment.NODE_ENV !== 'development') return
  if (!config.development.SEED_SAMPLE_EVENTS) return
  try {
    app.log.info('🌱 Seeding demo owners and events (dev)...')
    // Upsert 4 owners
    const owners = [
      { email: 'alice@kitchenco.dev', name: 'Alice Wonderland' },
      { email: 'bob@designbuild.dev', name: 'Bob The Builder' },
      { email: 'carla@artisanstudio.dev', name: 'Carla Rossi' },
      { email: 'diego@studioforma.dev', name: 'Diego Bianchi' },
    ]
    const createdOwners: Array<{ id: string; email: string } > = []
    for (const o of owners) {
      const user = await prisma.user.upsert({
        where: { email: o.email },
        update: { role: 'OWNER', name: o.name, isActive: true, lastLoginAt: new Date() },
        create: { email: o.email, role: 'OWNER', name: o.name, isActive: true, lastLoginAt: new Date() }
      })
      createdOwners.push({ id: user.id, email: user.email })
    }

    // Helper to ensure event once per owner+title
    const ensureEvent = async (ownerId: string, title: string, start: string, short?: string) => {
      const existing = await prisma.event.findFirst({ where: { ownerId, title, deletedAt: null } })
      if (existing) return existing
      const slug = await generateUniqueSlug(title)
      return await prisma.event.create({
        data: {
          ownerId,
          title,
          slug,
          shortDescription: short ?? null,
          description: null,
          status: 'PUBLISHED',
          startDate: new Date(start),
          isPublic: true,
          featured: false,
          tags: ['design']
        }
      })
    }

    // Create a few events per owner
    const now = new Date()
    const iso = (d: Date) => d.toISOString()
    const d1 = new Date(now.getTime() + 3*24*60*60*1000)
    const d2 = new Date(now.getTime() + 5*24*60*60*1000)
    const d3 = new Date(now.getTime() + 7*24*60*60*1000)

    for (const o of createdOwners) {
      await ensureEvent(o.id, 'Milano Design Showcase', iso(d1), 'Design showcase')
      await ensureEvent(o.id, 'Innovation Talk', iso(d2), 'Innovation talk')
      await ensureEvent(o.id, 'Studio Open Day', iso(d3), 'Open day')
    }

    app.log.info('✅ Demo data ready')
  } catch (error) {
    // If DB unavailable, skip silently for dev
    app.log.warn({ error }, 'Skipping demo seed (likely DB unavailable)')
  }
}
*/

// Register favorites routes
await app.register(favoritesRoutes)

// Start server
const start = async () => {
  try {
    // Run migrations first
    await runMigrations()
    // Seeding removed to prevent duplicate events
    
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