import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()

// Validation schemas
const createVenueSchema = z.object({
  name: z.string().min(1).max(200),
  address: z.string().min(1).max(500),
  city: z.string().min(1).max(100),
  country: z.string().min(1).max(100),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  website: z.string().url().optional()
})

const updateVenueSchema = createVenueSchema.partial()

const venueQuerySchema = z.object({
  search: z.string().optional(),
  city: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0)
})

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

export async function venueRoutes(fastify: FastifyInstance) {
  // Get all venues (public)
  fastify.get('/venues', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const query = venueQuerySchema.parse(request.query)
      
      const where: any = {
        deletedAt: null
      }
      
      if (query.search) {
        where.OR = [
          { name: { contains: query.search, mode: 'insensitive' } },
          { address: { contains: query.search, mode: 'insensitive' } },
          { city: { contains: query.search, mode: 'insensitive' } }
        ]
      }
      
      if (query.city) {
        where.city = { contains: query.city, mode: 'insensitive' }
      }
      
      const venues = await prisma.venue.findMany({
        where,
        include: {
          _count: {
            select: { events: true }
          }
        },
        orderBy: {
          name: 'asc'
        },
        take: query.limit,
        skip: query.offset
      })
      
      const total = await prisma.venue.count({ where })
      
      return {
        venues,
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
      
      reply.code(500).send({ error: 'Failed to fetch venues' })
    }
  })

  // Get venue by ID (public)
  fastify.get('/venues/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string }
      
      const venue = await prisma.venue.findUnique({
        where: { id },
        include: {
          events: {
            where: {
              status: 'PUBLISHED',
              deletedAt: null
            },
            select: {
              id: true,
              title: true,
              slug: true,
              startDate: true,
              endDate: true
            },
            orderBy: {
              startDate: 'asc'
            }
          },
          _count: {
            select: { events: true }
          }
        }
      })
      
      if (!venue || venue.deletedAt) {
        reply.code(404).send({ error: 'Venue not found' })
        return
      }
      
      return { venue }
    } catch (error) {
      reply.code(500).send({ error: 'Failed to fetch venue' })
    }
  })

  // Create venue (authenticated)
  fastify.post('/venues', { preHandler: authenticate }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body = createVenueSchema.parse(request.body)
      
      const venue = await prisma.venue.create({
        data: {
          name: body.name,
          address: body.address,
          city: body.city,
          country: body.country,
          latitude: body.latitude || null,
          longitude: body.longitude || null,
          website: body.website || null
        } as any,
        include: {
          _count: {
            select: { events: true }
          }
        }
      })
      
      return {
        venue,
        message: 'Venue created successfully'
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        reply.code(400).send({ error: 'Validation error', details: error.errors })
        return
      }
      
      reply.code(500).send({ error: 'Failed to create venue' })
    }
  })

  // Update venue (authenticated)
  fastify.put('/venues/:id', { preHandler: authenticate }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string }
      const body = updateVenueSchema.parse(request.body)
      
      const existingVenue = await prisma.venue.findUnique({
        where: { id }
      })
      
      if (!existingVenue || existingVenue.deletedAt) {
        reply.code(404).send({ error: 'Venue not found' })
        return
      }
      
      const updateData: any = {}
      
      if (body.name) updateData.name = body.name
      if (body.address) updateData.address = body.address
      if (body.city) updateData.city = body.city
      if (body.country) updateData.country = body.country
      if (body.latitude !== undefined) updateData.latitude = body.latitude || null
      if (body.longitude !== undefined) updateData.longitude = body.longitude || null
      if (body.website !== undefined) updateData.website = body.website || null
      
      const venue = await prisma.venue.update({
        where: { id },
        data: updateData,
        include: {
          _count: {
            select: { events: true }
          }
        }
      })
      
      return {
        venue,
        message: 'Venue updated successfully'
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        reply.code(400).send({ error: 'Validation error', details: error.errors })
        return
      }
      
      reply.code(500).send({ error: 'Failed to update venue' })
    }
  })

  // Delete venue (authenticated)
  fastify.delete('/venues/:id', { preHandler: authenticate }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string }
      
      const existingVenue = await prisma.venue.findUnique({
        where: { id },
        include: {
          _count: {
            select: { events: true }
          }
        }
      })
      
      if (!existingVenue || existingVenue.deletedAt) {
        reply.code(404).send({ error: 'Venue not found' })
        return
      }
      
      if (existingVenue._count.events > 0) {
        reply.code(400).send({ 
          error: 'Cannot delete venue with existing events',
          message: 'Please remove or reassign all events from this venue first'
        })
        return
      }
      
      // Soft delete
      await prisma.venue.update({
        where: { id },
        data: { deletedAt: new Date() }
      })
      
      return { message: 'Venue deleted successfully' }
    } catch (error) {
      reply.code(500).send({ error: 'Failed to delete venue' })
    }
  })

  // Search venues by location (public)
  fastify.get('/venues/search', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { lat, lng, radius = '10' } = request.query as { 
        lat: string, 
        lng: string, 
        radius?: string 
      }
      
      const latitude = parseFloat(lat)
      const longitude = parseFloat(lng)
      const radiusKm = parseFloat(radius)
      
      if (isNaN(latitude) || isNaN(longitude) || isNaN(radiusKm)) {
        reply.code(400).send({ error: 'Invalid coordinates or radius' })
        return
      }
      
      // Simple bounding box search (for production, use PostGIS or similar)
      const venues = await prisma.venue.findMany({
        where: {
          deletedAt: null,
          latitude: {
            gte: latitude - (radiusKm / 111), // Rough conversion: 1 degree ≈ 111 km
            lte: latitude + (radiusKm / 111)
          },
          longitude: {
            gte: longitude - (radiusKm / (111 * Math.cos(latitude * Math.PI / 180))),
            lte: longitude + (radiusKm / (111 * Math.cos(latitude * Math.PI / 180)))
          }
        },
        include: {
          _count: {
            select: { events: true }
          }
        },
        orderBy: {
          name: 'asc'
        }
      })
      
      return { venues }
    } catch (error) {
      reply.code(500).send({ error: 'Failed to search venues' })
    }
  })
}
