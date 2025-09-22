import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import { z } from 'zod'

export async function adminRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  // Get admin dashboard data
  fastify.get('/dashboard', {
    response: {
      200: {
        type: 'object',
        properties: {
          stats: {
            type: 'object',
            properties: {
              totalOwners: { type: 'number' },
              totalEvents: { type: 'number' },
              totalWaitlist: { type: 'number' },
              activeRate: { type: 'number' },
              pendingReviews: { type: 'number' }
            }
          },
          recentActivity: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                type: { type: 'string' },
                description: { type: 'string' },
                timestamp: { type: 'string' },
                status: { type: 'string' }
              }
            }
          }
        }
      }
    }
  }, async (request, reply) => {
    // TODO: Implement admin dashboard data fetching
    fastify.log.info('Fetching admin dashboard data')
    
    return {
      stats: {
        totalOwners: 156,
        totalEvents: 1234,
        totalWaitlist: 45678,
        activeRate: 89,
        pendingReviews: 12
      },
      recentActivity: [
        {
          id: 'activity-1',
          type: 'EVENT_CREATED',
          description: 'New Event Created: "Milano Design Week 2024" by Design Studio Milano',
          timestamp: '2024-01-15T12:00:00Z',
          status: 'PENDING'
        }
      ]
    }
  })

  // Get all owners
  fastify.get('/owners', {
    schema: {
      querystring: z.object({
        page: z.string().optional().default('1'),
        limit: z.string().optional().default('20'),
        search: z.string().optional(),
        status: z.enum(['ACTIVE', 'SUSPENDED']).optional()
      }),
      response: {
        200: {
          type: 'object',
          properties: {
            owners: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  email: { type: 'string' },
                  name: { type: 'string' },
                  organizationName: { type: 'string' },
                  status: { type: 'string' },
                  createdAt: { type: 'string' },
                  eventCount: { type: 'number' }
                }
              }
            },
            pagination: {
              type: 'object',
              properties: {
                page: { type: 'number' },
                limit: { type: 'number' },
                total: { type: 'number' },
                totalPages: { type: 'number' }
              }
            }
          }
        }
      }
    }
  }, async (request, reply) => {
    const { page, limit, search, status } = request.query as z.infer<typeof adminRoutes.querystring>
    
    // TODO: Implement owners fetching
    fastify.log.info(`Fetching owners: page=${page}, search=${search}`)
    
    return {
      owners: [
        {
          id: 'owner-1',
          email: 'owner@example.com',
          name: 'John Doe',
          organizationName: 'Design Studio Milano',
          status: 'ACTIVE',
          createdAt: '2024-01-01T10:00:00Z',
          eventCount: 5
        }
      ],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: 1,
        totalPages: 1
      }
    }
  })

  // Get all events for admin review
  fastify.get('/events', {
    schema: {
      querystring: z.object({
        page: z.string().optional().default('1'),
        limit: z.string().optional().default('20'),
        status: z.enum(['DRAFT', 'PUBLISHED', 'CANCELLED', 'COMPLETED', 'PENDING_REVIEW']).optional(),
        search: z.string().optional()
      }),
      response: {
        200: {
          type: 'object',
          properties: {
            events: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  title: { type: 'string' },
                  slug: { type: 'string' },
                  status: { type: 'string' },
                  ownerName: { type: 'string' },
                  waitlistCount: { type: 'number' },
                  createdAt: { type: 'string' }
                }
              }
            },
            pagination: {
              type: 'object',
              properties: {
                page: { type: 'number' },
                limit: { type: 'number' },
                total: { type: 'number' },
                totalPages: { type: 'number' }
              }
            }
          }
        }
      }
    }
  }, async (request, reply) => {
    const { page, limit, status, search } = request.query as z.infer<typeof adminRoutes.querystring>
    
    // TODO: Implement admin events fetching
    fastify.log.info(`Fetching admin events: page=${page}, status=${status}`)
    
    return {
      events: [
        {
          id: 'event-1',
          title: 'Milano Design Week 2024',
          slug: 'milano-design-week-2024',
          status: 'PENDING_REVIEW',
          ownerName: 'Design Studio Milano',
          waitlistCount: 1234,
          createdAt: '2024-01-15T10:00:00Z'
        }
      ],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: 1,
        totalPages: 1
      }
    }
  })

  // Approve event
  fastify.post('/events/:id/approve', {
    schema: {
      params: z.object({
        id: z.string()
      }),
      response: {
        200: {
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
    const { id } = request.params as z.infer<typeof adminRoutes.params>
    
    // TODO: Implement event approval
    fastify.log.info(`Approving event: ${id}`)
    
    return {
      message: 'Event approved successfully'
    }
  })

  // Reject event
  fastify.post('/events/:id/reject', {
    schema: {
      params: z.object({
        id: z.string()
      }),
      body: z.object({
        reason: z.string().min(1)
      }),
      response: {
        200: {
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
    const { id } = request.params as z.infer<typeof adminRoutes.params>
    const { reason } = request.body as z.infer<typeof adminRoutes.body>
    
    // TODO: Implement event rejection
    fastify.log.info(`Rejecting event ${id}: ${reason}`)
    
    return {
      message: 'Event rejected successfully'
    }
  })
}
