import Fastify from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import { PrismaClient } from '@prisma/client'
import pino from 'pino'
import { authRoutes } from './routes/auth.js'
import { eventRoutes } from './routes/events.js'
import { venueRoutes } from './routes/venues.js'

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  ...(process.env.NODE_ENV === 'development' && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname'
      }
    }
  })
})

const app = Fastify({
  logger,
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
  origin: process.env.FRONTEND_URL || 'http://localhost:3030',
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
        url: process.env.API_URL || 'http://localhost:9030',
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

// Health check
app.get('/health', async (_request, reply) => {
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
app.get('/', async (_request, _reply) => {
  return { 
    message: 'Linea API is running!',
    version: '0.1.0',
    timestamp: new Date().toISOString()
  }
})

// Register API routes
await app.register(authRoutes, { prefix: '/api' })
await app.register(eventRoutes, { prefix: '/api' })
await app.register(venueRoutes, { prefix: '/api' })

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
    const port = parseInt(process.env.PORT || '9030')
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