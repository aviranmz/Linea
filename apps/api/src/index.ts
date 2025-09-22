import Fastify from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit'
import { PrismaClient } from '@prisma/client'

const app = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info'
  },
  requestIdHeader: 'x-request-id',
  requestIdLogLabel: 'reqId',
  genReqId: () => crypto.randomUUID()
})

// Initialize Prisma
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error']
})

// Register plugins
await app.register(cors, {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
})

await app.register(helmet, {
  contentSecurityPolicy: false
})

await app.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute'
})

// Health check
app.get('/health', async (request, reply) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`
    
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected'
      }
    }
  } catch (error) {
    reply.code(503)
    return {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
})

// Basic API routes
app.get('/', async (request, reply) => {
  return { 
    message: 'Linea API is running!',
    version: '0.1.0',
    timestamp: new Date().toISOString()
  }
})

// Events API
app.get('/api/events', async (request, reply) => {
  try {
    const events = await prisma.event.findMany({
      where: {
        status: 'PUBLISHED',
        deletedAt: null
      },
      include: {
        venue: true
      },
      orderBy: {
        startDate: 'asc'
      }
    })
    
    return { events }
  } catch (error) {
    reply.code(500)
    return { error: 'Failed to fetch events' }
  }
})

app.get('/api/events/:slug', async (request, reply) => {
  try {
    const { slug } = request.params as { slug: string }
    
    const event = await prisma.event.findUnique({
      where: { slug },
      include: {
        venue: true,
        waitlist: true
      }
    })
    
    if (!event) {
      reply.code(404)
      return { error: 'Event not found' }
    }
    
    return { event }
  } catch (error) {
    reply.code(500)
    return { error: 'Failed to fetch event' }
  }
})

// Waitlist API
app.post('/api/waitlist', async (request, reply) => {
  try {
    const { email, eventId } = request.body as { email: string; eventId: string }
    
    // Check if already on waitlist
    const existing = await prisma.waitlistEntry.findUnique({
      where: {
        email_eventId: {
          email,
          eventId
        }
      }
    })
    
    if (existing) {
      reply.code(400)
      return { error: 'Email already on waitlist for this event' }
    }
    
    const waitlistEntry = await prisma.waitlistEntry.create({
      data: {
        email,
        eventId,
        status: 'PENDING'
      }
    })
    
    return { waitlistEntry }
  } catch (error) {
    reply.code(500)
    return { error: 'Failed to join waitlist' }
  }
})

// Error handler
app.setErrorHandler((error, request, reply) => {
  app.log.error(error)
  
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
    await prisma.$disconnect()
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
    const port = parseInt(process.env.PORT || '3001')
    const host = process.env.HOST || '0.0.0.0'
    
    await app.listen({ port, host })
    app.log.info(`Server listening on http://${host}:${port}`)
  } catch (error) {
    app.log.error(error)
    process.exit(1)
  }
}

start()