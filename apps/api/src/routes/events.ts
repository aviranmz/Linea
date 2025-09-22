import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()

// Validation schemas
const createEventSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  capacity: z.number().int().positive().optional(),
  youtubeUrl: z.string().url().optional(),
  mapLat: z.number().optional(),
  mapLng: z.number().optional(),
  mapZoom: z.number().int().min(1).max(20).optional(),
  venueId: z.string().cuid().optional()
})

const updateEventSchema = createEventSchema.partial()

const eventQuerySchema = z.object({
  status: z.enum(['DRAFT', 'PUBLISHED', 'CANCELLED', 'COMPLETED']).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0)
})

// Helper function to generate slug
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// Auth middleware
const authenticate = async (request: FastifyRequest, reply: FastifyReply) => {
  const token = request.headers.authorization?.replace('Bearer ', '')
  
  if (!token) {
    reply.code(401).send({ error: 'Authentication required' })
    return
  }

  try {
    const jwt = require('jsonwebtoken')
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as { userId: string }
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, name: true, role: true }
    })

    if (!user) {
      reply.code(401).send({ error: 'User not found' })
      return
    }

    request.user = user
  } catch {
    reply.code(401).send({ error: 'Invalid token' })
    return
  }
}

export async function eventRoutes(fastify: FastifyInstance) {
  // Get all events (public)
  fastify.get('/events', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const query = eventQuerySchema.parse(request.query)
      
      const events = await prisma.event.findMany({
        where: {
          status: query.status || 'PUBLISHED',
          deletedAt: null
        },
        include: {
          venue: true,
          owner: {
            select: { id: true, name: true, email: true }
          },
          _count: {
            select: { waitlist: true }
          }
        },
        orderBy: {
          startDate: 'asc'
        },
        take: query.limit,
        skip: query.offset
      })
      
      const total = await prisma.event.count({
        where: {
          status: query.status || 'PUBLISHED',
          deletedAt: null
        }
      })
      
      return {
        events,
        pagination: {
          total,
          limit: query.limit,
          offset: query.offset,
          hasMore: query.offset + query.limit < total
        }
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        reply.code(400).send({ error: 'Validation error', details: error.errors })
        return
      }
      
      reply.code(500).send({ error: 'Failed to fetch events' })
    }
  })

  // Get event by slug (public)
  fastify.get('/events/:slug', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { slug } = request.params as { slug: string }
      
      const event = await prisma.event.findUnique({
        where: { slug },
        include: {
          venue: true,
          owner: {
            select: { id: true, name: true, email: true }
          },
          waitlist: {
            where: { status: 'PENDING' },
            select: { id: true, email: true, createdAt: true }
          }
        }
      })
      
      if (!event || event.deletedAt) {
        reply.code(404).send({ error: 'Event not found' })
        return
      }
      
      return { event }
    } catch (error) {
      reply.code(500).send({ error: 'Failed to fetch event' })
    }
  })

  // Create event (authenticated)
  fastify.post('/events', { preHandler: authenticate }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body = createEventSchema.parse(request.body)
      const user = request.user as any
      
      // Generate unique slug
      let slug = generateSlug(body.title)
      let counter = 1
      
      while (await prisma.event.findUnique({ where: { slug } })) {
        slug = `${generateSlug(body.title)}-${counter}`
        counter++
      }
      
      const event = await prisma.event.create({
        data: {
          title: body.title,
          description: body.description,
          startDate: new Date(body.startDate),
          endDate: body.endDate ? new Date(body.endDate) : null,
          capacity: body.capacity,
          youtubeUrl: body.youtubeUrl,
          mapLat: body.mapLat,
          mapLng: body.mapLng,
          mapZoom: body.mapZoom,
          venueId: body.venueId,
          slug,
          ownerId: user.id
        } as any,
        include: {
          venue: true,
          owner: {
            select: { id: true, name: true, email: true }
          }
        }
      })
      
      return {
        event,
        message: 'Event created successfully'
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        reply.code(400).send({ error: 'Validation error', details: error.errors })
        return
      }
      
      reply.code(500).send({ error: 'Failed to create event' })
    }
  })

  // Update event (authenticated, owner only)
  fastify.put('/events/:id', { preHandler: authenticate }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string }
      const body = updateEventSchema.parse(request.body)
      const user = request.user as any
      
      // Check if event exists and user owns it
      const existingEvent = await prisma.event.findUnique({
        where: { id }
      })
      
      if (!existingEvent || existingEvent.deletedAt) {
        reply.code(404).send({ error: 'Event not found' })
        return
      }
      
      if (existingEvent.ownerId !== user.id && user.role !== 'ADMIN') {
        reply.code(403).send({ error: 'Not authorized to update this event' })
        return
      }
      
      // Generate new slug if title changed
      let slug = existingEvent.slug
      if (body.title && body.title !== existingEvent.title) {
        slug = generateSlug(body.title)
        let counter = 1
        
        while (await prisma.event.findUnique({ where: { slug } })) {
          slug = `${generateSlug(body.title)}-${counter}`
          counter++
        }
      }
      
      const updateData: any = { slug }
      
      if (body.title) updateData.title = body.title
      if (body.description !== undefined) updateData.description = body.description
      if (body.startDate) updateData.startDate = new Date(body.startDate)
      if (body.endDate !== undefined) updateData.endDate = body.endDate ? new Date(body.endDate) : null
      if (body.capacity !== undefined) updateData.capacity = body.capacity
      if (body.youtubeUrl !== undefined) updateData.youtubeUrl = body.youtubeUrl
      if (body.mapLat !== undefined) updateData.mapLat = body.mapLat
      if (body.mapLng !== undefined) updateData.mapLng = body.mapLng
      if (body.mapZoom !== undefined) updateData.mapZoom = body.mapZoom
      if (body.venueId !== undefined) updateData.venueId = body.venueId
      
      const event = await prisma.event.update({
        where: { id },
        data: updateData,
        include: {
          venue: true,
          owner: {
            select: { id: true, name: true, email: true }
          }
        }
      })
      
      return {
        event,
        message: 'Event updated successfully'
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        reply.code(400).send({ error: 'Validation error', details: error.errors })
        return
      }
      
      reply.code(500).send({ error: 'Failed to update event' })
    }
  })

  // Delete event (authenticated, owner only)
  fastify.delete('/events/:id', { preHandler: authenticate }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string }
      const user = request.user as any
      
      // Check if event exists and user owns it
      const existingEvent = await prisma.event.findUnique({
        where: { id }
      })
      
      if (!existingEvent || existingEvent.deletedAt) {
        reply.code(404).send({ error: 'Event not found' })
        return
      }
      
      if (existingEvent.ownerId !== user.id && user.role !== 'ADMIN') {
        reply.code(403).send({ error: 'Not authorized to delete this event' })
        return
      }
      
      // Soft delete
      await prisma.event.update({
        where: { id },
        data: { deletedAt: new Date() }
      })
      
      return { message: 'Event deleted successfully' }
    } catch (error) {
      reply.code(500).send({ error: 'Failed to delete event' })
    }
  })

  // Get user's events (authenticated)
  fastify.get('/events/my', { preHandler: authenticate }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = request.user as any
      const query = eventQuerySchema.parse(request.query)
      
      const where: any = {
        ownerId: user.id,
        deletedAt: null
      }
      
      if (query.status) {
        where.status = query.status
      }
      
      const events = await prisma.event.findMany({
        where,
        include: {
          venue: true,
          _count: {
            select: { waitlist: true }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: query.limit,
        skip: query.offset
      })
      
      const total = await prisma.event.count({ where })
      
      return {
        events,
        pagination: {
          total,
          limit: query.limit,
          offset: query.offset,
          hasMore: query.offset + query.limit < total
        }
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        reply.code(400).send({ error: 'Validation error', details: error.errors })
        return
      }
      
      reply.code(500).send({ error: 'Failed to fetch your events' })
    }
  })
}
