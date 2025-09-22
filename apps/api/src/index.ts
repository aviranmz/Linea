import Fastify from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import fastifyStatic from '@fastify/static'
import { PrismaClient } from '@prisma/client'
import path from 'path'
import { fileURLToPath } from 'url'

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = Fastify({
  logger: process.env.NODE_ENV === 'development' ? {
    level: process.env.LOG_LEVEL || 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname'
      }
    }
  } : true,
  requestIdHeader: 'x-request-id',
  requestIdLogLabel: 'reqId',
  genReqId: () => crypto.randomUUID()
})

// Initialize Prisma (only if DATABASE_URL is available)
let prisma: PrismaClient | null = null
if (process.env.DATABASE_URL) {
  prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error']
  })
}

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

await app.register(swagger, {
  openapi: {
    info: {
      title: 'Linea API',
      description: 'Event management platform API',
      version: '0.1.0'
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:3001',
        description: 'Development server'
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

// Health check
app.get('/health', async (_request, reply) => {
  try {
    const services: Record<string, string> = {}
    
    if (prisma) {
      // Check database connection
      await prisma.$queryRaw`SELECT 1`
      services.database = 'connected'
    } else {
      services.database = 'not configured'
    }

    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services
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
app.get('/', async (_request, _reply) => {
  return {
    message: 'Linea API is running!',
    version: '0.1.0',
    timestamp: new Date().toISOString()
  }
})

// Simple API routes (database-independent for now)
app.get('/api/events', async (_request, reply) => {
  // Return mock data for now
  return { 
    events: [
      {
        id: '1',
        title: 'Sample Event',
        slug: 'sample-event',
        description: 'This is a sample event',
        startDate: new Date().toISOString(),
        status: 'PUBLISHED'
      }
    ]
  }
})

app.get('/api/events/:slug', async (request, reply) => {
  const { slug } = request.params as { slug: string }
  
  // Return mock data for now
  return {
    event: {
      id: '1',
      title: 'Sample Event',
      slug: slug,
      description: 'This is a sample event',
      startDate: new Date().toISOString(),
      status: 'PUBLISHED'
    }
  }
})

// Waitlist API (mock for now)
app.post('/api/waitlist', async (request, reply) => {
  const { email, eventId } = request.body as { email: string; eventId: string }
  
  // Return mock response
  return {
    waitlistEntry: {
      id: '1',
      email,
      eventId,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    }
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
    const port = parseInt(process.env.PORT || '3001')
    const host = process.env.HOST || '0.0.0.0'

    await app.listen({ port, host })
    app.log.info(`Server listening on http://${host}:${port}`)
    app.log.info(`API documentation available at http://${host}:${port}/docs`)
  } catch (error) {
    app.log.error({ error }, 'Failed to start server')
    process.exit(1)
  }
}

start()