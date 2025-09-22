import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import { z } from 'zod'

const prisma = new PrismaClient()

// Validation schemas
const registerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(100),
  password: z.string().min(8)
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
})

const waitlistSchema = z.object({
  email: z.string().email(),
  eventId: z.string().cuid()
})

// JWT helper functions
const generateToken = (userId: string): string => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'fallback-secret',
    { expiresIn: '7d' }
  )
}

const verifyToken = (token: string): { userId: string } | null => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as { userId: string }
  } catch {
    return null
  }
}

// Auth middleware
const authenticate = async (request: FastifyRequest, reply: FastifyReply) => {
  const token = request.headers.authorization?.replace('Bearer ', '')
  
  if (!token) {
    reply.code(401).send({ error: 'Authentication required' })
    return
  }

  const decoded = verifyToken(token)
  if (!decoded) {
    reply.code(401).send({ error: 'Invalid token' })
    return
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    select: { id: true, email: true, name: true, role: true }
  })

  if (!user) {
    reply.code(401).send({ error: 'User not found' })
    return
  }

  request.user = user
}

export async function authRoutes(fastify: FastifyInstance) {
  // Register user
  fastify.post('/auth/register', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body = registerSchema.parse(request.body)
      
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: body.email }
      })
      
      if (existingUser) {
        reply.code(400).send({ error: 'User already exists' })
        return
      }
      
      // Create user (in real app, hash password)
      const user = await prisma.user.create({
        data: {
          email: body.email,
          name: body.name,
          role: 'OWNER' // Default role for registration
        },
        select: { id: true, email: true, name: true, role: true }
      })
      
      const token = generateToken(user.id)
      
      return {
        user,
        token,
        message: 'User registered successfully'
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        reply.code(400).send({ error: 'Validation error', details: error.errors })
        return
      }
      
      reply.code(500).send({ error: 'Registration failed' })
    }
  })

  // Login user
  fastify.post('/auth/login', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body = loginSchema.parse(request.body)
      
      const user = await prisma.user.findUnique({
        where: { email: body.email },
        select: { id: true, email: true, name: true, role: true }
      })
      
      if (!user) {
        reply.code(401).send({ error: 'Invalid credentials' })
        return
      }
      
      // In real app, verify password hash
      const token = generateToken(user.id)
      
      return {
        user,
        token,
        message: 'Login successful'
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        reply.code(400).send({ error: 'Validation error', details: error.errors })
        return
      }
      
      reply.code(500).send({ error: 'Login failed' })
    }
  })

  // Get current user
  fastify.get('/auth/me', { preHandler: authenticate }, async (request: FastifyRequest, reply: FastifyReply) => {
    return { user: request.user }
  })

  // Join waitlist (no auth required)
  fastify.post('/auth/waitlist', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body = waitlistSchema.parse(request.body)
      
      // Check if event exists
      const event = await prisma.event.findUnique({
        where: { id: body.eventId }
      })
      
      if (!event) {
        reply.code(404).send({ error: 'Event not found' })
        return
      }
      
      // Check if already on waitlist
      const existing = await prisma.waitlistEntry.findUnique({
        where: {
          email_eventId: {
            email: body.email,
            eventId: body.eventId
          }
        }
      })
      
      if (existing) {
        reply.code(400).send({ error: 'Email already on waitlist for this event' })
        return
      }
      
      const waitlistEntry = await prisma.waitlistEntry.create({
        data: {
          email: body.email,
          eventId: body.eventId,
          status: 'PENDING'
        }
      })
      
      return {
        waitlistEntry,
        message: 'Successfully joined waitlist'
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        reply.code(400).send({ error: 'Validation error', details: error.errors })
        return
      }
      
      reply.code(500).send({ error: 'Failed to join waitlist' })
    }
  })
}
