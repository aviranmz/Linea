import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { z } from 'zod';

const ownerRegistrationSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  organizationName: z.string().min(1),
  organizationDescription: z.string().optional(),
  website: z.string().url().optional(),
});

export async function ownerRoutes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
  // Register as owner
  fastify.post(
    '/register',
    {
      schema: {
        body: ownerRegistrationSchema,
        response: {
          201: {
            type: 'object',
            properties: {
              message: { type: 'string' },
              ownerId: { type: 'string' },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const ownerData = request.body as z.infer<typeof ownerRegistrationSchema>;

      // TODO: Implement owner registration
      fastify.log.info(`Owner registration: ${ownerData.email}`);

      reply.code(201);
      return {
        message:
          'Owner registration successful. Please check your email for verification.',
        ownerId: 'owner-new',
      };
    }
  );

  // Get owner dashboard data
  fastify.get(
    '/dashboard',
    {
      response: {
        200: {
          type: 'object',
          properties: {
            stats: {
              type: 'object',
              properties: {
                totalEvents: { type: 'number' },
                totalWaitlist: { type: 'number' },
                conversionRate: { type: 'number' },
                activeEvents: { type: 'number' },
              },
            },
            recentEvents: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  title: { type: 'string' },
                  status: { type: 'string' },
                  waitlistCount: { type: 'number' },
                  createdAt: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
    async (request, reply) => {
      // TODO: Implement dashboard data fetching
      fastify.log.info('Fetching owner dashboard data');

      return {
        stats: {
          totalEvents: 12,
          totalWaitlist: 1234,
          conversionRate: 89,
          activeEvents: 5,
        },
        recentEvents: [
          {
            id: 'event-1',
            title: 'Milano Design Week 2024',
            status: 'PUBLISHED',
            waitlistCount: 1234,
            createdAt: '2024-01-15T10:00:00Z',
          },
        ],
      };
    }
  );

  // Get owner events
  fastify.get(
    '/events',
    {
      schema: {
        querystring: z.object({
          page: z.string().optional().default('1'),
          limit: z.string().optional().default('10'),
          status: z
            .enum(['DRAFT', 'PUBLISHED', 'CANCELLED', 'COMPLETED'])
            .optional(),
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
                    waitlistCount: { type: 'number' },
                    createdAt: { type: 'string' },
                  },
                },
              },
              pagination: {
                type: 'object',
                properties: {
                  page: { type: 'number' },
                  limit: { type: 'number' },
                  total: { type: 'number' },
                  totalPages: { type: 'number' },
                },
              },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const { page, limit, status } = request.query as z.infer<
        typeof ownerRoutes.querystring
      >;

      // TODO: Implement owner events fetching
      fastify.log.info(`Fetching owner events: page=${page}, status=${status}`);

      return {
        events: [
          {
            id: 'event-1',
            title: 'Milano Design Week 2024',
            slug: 'milano-design-week-2024',
            status: 'PUBLISHED',
            waitlistCount: 1234,
            createdAt: '2024-01-15T10:00:00Z',
          },
        ],
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: 1,
          totalPages: 1,
        },
      };
    }
  );
}
