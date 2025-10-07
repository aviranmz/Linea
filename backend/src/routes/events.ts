import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { z } from 'zod';

const eventSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  capacity: z.number().int().positive().optional(),
  youtubeUrl: z.string().url().optional(),
  mapLat: z.number().optional(),
  mapLng: z.number().optional(),
  mapZoom: z.number().int().optional(),
  venueId: z.string().optional(),
});

export async function eventRoutes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
  // Get all events
  fastify.get(
    '/',
    {
      schema: {
        querystring: z.object({
          page: z.string().optional().default('1'),
          limit: z.string().optional().default('10'),
          status: z
            .enum(['DRAFT', 'PUBLISHED', 'CANCELLED', 'COMPLETED'])
            .optional(),
          category: z.string().optional(),
          search: z.string().optional(),
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
                    description: { type: 'string' },
                    status: { type: 'string' },
                    startDate: { type: 'string' },
                    endDate: { type: 'string' },
                    capacity: { type: 'number' },
                    waitlistCount: { type: 'number' },
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
      const { page, limit, status, category, search } =
        request.query as z.infer<typeof eventRoutes.querystring>;

      // TODO: Implement event listing with filters and pagination
      fastify.log.info(
        `Fetching events: page=${page}, limit=${limit}, status=${status}`
      );

      return {
        events: [
          {
            id: 'event-1',
            title: 'Milano Design Week 2024',
            slug: 'milano-design-week-2024',
            description:
              'Discover the latest in design innovation and creativity',
            status: 'PUBLISHED',
            startDate: '2024-04-15T10:00:00Z',
            endDate: '2024-04-21T20:00:00Z',
            capacity: 500,
            waitlistCount: 1234,
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

  // Get event by slug
  fastify.get(
    '/:slug',
    {
      schema: {
        params: z.object({
          slug: z.string(),
        }),
        response: {
          200: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              title: { type: 'string' },
              slug: { type: 'string' },
              description: { type: 'string' },
              status: { type: 'string' },
              startDate: { type: 'string' },
              endDate: { type: 'string' },
              capacity: { type: 'number' },
              youtubeUrl: { type: 'string' },
              mapLat: { type: 'number' },
              mapLng: { type: 'number' },
              mapZoom: { type: 'number' },
              waitlistCount: { type: 'number' },
              venue: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                  address: { type: 'string' },
                  city: { type: 'string' },
                  country: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const { slug } = request.params as z.infer<typeof eventRoutes.params>;

      // TODO: Implement event fetching by slug
      fastify.log.info(`Fetching event: ${slug}`);

      return {
        id: 'event-1',
        title: 'Milano Design Week 2024',
        slug: slug,
        description: 'Discover the latest in design innovation and creativity',
        status: 'PUBLISHED',
        startDate: '2024-04-15T10:00:00Z',
        endDate: '2024-04-21T20:00:00Z',
        capacity: 500,
        youtubeUrl: 'https://youtube.com/watch?v=example',
        mapLat: 45.4654,
        mapLng: 9.1859,
        mapZoom: 15,
        waitlistCount: 1234,
        venue: {
          id: 'venue-1',
          name: 'Fiera Milano Rho',
          address: 'Strada Statale del Sempione, 28',
          city: 'Milan',
          country: 'Italy',
        },
      };
    }
  );

  // Create event (owner only)
  fastify.post(
    '/',
    {
      schema: {
        body: eventSchema,
        response: {
          201: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              title: { type: 'string' },
              slug: { type: 'string' },
              message: { type: 'string' },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const eventData = request.body as z.infer<typeof eventSchema>;

      // TODO: Implement event creation
      fastify.log.info(`Creating event: ${eventData.title}`);

      reply.code(201);
      return {
        id: 'event-new',
        title: eventData.title,
        slug: 'new-event-slug',
        message: 'Event created successfully',
      };
    }
  );

  // Update event (owner only)
  fastify.put(
    '/:id',
    {
      schema: {
        params: z.object({
          id: z.string(),
        }),
        body: eventSchema,
        response: {
          200: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              title: { type: 'string' },
              message: { type: 'string' },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params as z.infer<typeof eventRoutes.params>;
      const eventData = request.body as z.infer<typeof eventSchema>;

      // TODO: Implement event updating
      fastify.log.info(`Updating event ${id}: ${eventData.title}`);

      return {
        id: id,
        title: eventData.title,
        message: 'Event updated successfully',
      };
    }
  );

  // Delete event (owner only)
  fastify.delete(
    '/:id',
    {
      schema: {
        params: z.object({
          id: z.string(),
        }),
        response: {
          200: {
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params as z.infer<typeof eventRoutes.params>;

      // TODO: Implement event deletion
      fastify.log.info(`Deleting event: ${id}`);

      return {
        message: 'Event deleted successfully',
      };
    }
  );
}
