// User preferences API routes
import { FastifyInstance } from 'fastify';
import { UserPreferencesService } from '../services/userPreferencesService.js';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;

export async function userPreferencesRoutes(fastify: FastifyInstance) {
  const prisma = new PrismaClient();
  const preferencesService = new UserPreferencesService(prisma);

  // Get user preferences
  fastify.get(
    '/preferences',
    {
      schema: {
        description: 'Get user preferences',
        tags: ['User Preferences'],
        security: [{ bearerAuth: [] }],
        response: {
          200: {
            type: 'object',
            properties: {
              preferences: { type: 'object' },
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const userId = (request as any).user?.id;
        if (!userId) {
          return reply.status(401).send({ error: 'Unauthorized' });
        }

        const preferences = await preferencesService.getUserPreferences(userId);
        return { preferences };
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({ error: 'Internal server error' });
      }
    }
  );

  // Update user preferences
  fastify.put(
    '/preferences',
    {
      schema: {
        description: 'Update user preferences',
        tags: ['User Preferences'],
        security: [{ bearerAuth: [] }],
        body: {
          type: 'object',
          properties: {
            preferences: { type: 'object' },
          },
          required: ['preferences'],
        },
        response: {
          200: {
            type: 'object',
            properties: {
              preferences: { type: 'object' },
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const userId = (request as any).user?.id;
        if (!userId) {
          return reply.status(401).send({ error: 'Unauthorized' });
        }

        const { preferences } = request.body as { preferences: any };

        // Validate preferences
        const validation =
          await preferencesService.validatePreferences(preferences);
        if (!validation.valid) {
          return reply.status(400).send({
            error: 'Invalid preferences',
            details: validation.errors,
          });
        }

        const updatedPreferences =
          await preferencesService.updateUserPreferences(userId, preferences);
        return { preferences: updatedPreferences };
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({ error: 'Internal server error' });
      }
    }
  );

  // Update specific preference path
  fastify.patch(
    '/preferences/:path*',
    {
      schema: {
        description: 'Update specific preference path',
        tags: ['User Preferences'],
        security: [{ bearerAuth: [] }],
        params: {
          type: 'object',
          properties: {
            path: { type: 'string' },
          },
        },
        body: {
          type: 'object',
          properties: {
            value: {},
            operation: {
              type: 'string',
              enum: ['set', 'merge', 'remove'],
              default: 'set',
            },
          },
          required: ['value'],
        },
        response: {
          200: {
            type: 'object',
            properties: {
              preferences: { type: 'object' },
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const userId = (request as any).user?.id;
        if (!userId) {
          return reply.status(401).send({ error: 'Unauthorized' });
        }

        const { path } = request.params as { path: string };
        const { value, operation = 'set' } = request.body as {
          value: any;
          operation?: 'set' | 'merge' | 'remove';
        };

        const updatedPreferences =
          await preferencesService.updatePreferencePath(
            userId,
            path,
            value,
            operation
          );
        return { preferences: updatedPreferences };
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({ error: 'Internal server error' });
      }
    }
  );

  // Batch update preferences
  fastify.patch(
    '/preferences/batch',
    {
      schema: {
        description: 'Batch update preferences',
        tags: ['User Preferences'],
        security: [{ bearerAuth: [] }],
        body: {
          type: 'object',
          properties: {
            updates: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  path: { type: 'string' },
                  value: {},
                  operation: {
                    type: 'string',
                    enum: ['set', 'merge', 'remove'],
                    default: 'set',
                  },
                },
                required: ['path', 'value'],
              },
            },
          },
          required: ['updates'],
        },
        response: {
          200: {
            type: 'object',
            properties: {
              preferences: { type: 'object' },
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const userId = (request as any).user?.id;
        if (!userId) {
          return reply.status(401).send({ error: 'Unauthorized' });
        }

        const { updates } = request.body as { updates: any[] };

        const updatedPreferences =
          await preferencesService.batchUpdatePreferences(userId, updates);
        return { preferences: updatedPreferences };
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({ error: 'Internal server error' });
      }
    }
  );

  // Reset preferences
  fastify.delete(
    '/preferences',
    {
      schema: {
        description: 'Reset user preferences',
        tags: ['User Preferences'],
        security: [{ bearerAuth: [] }],
        querystring: {
          type: 'object',
          properties: {
            category: { type: 'string' },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              preferences: { type: 'object' },
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const userId = (request as any).user?.id;
        if (!userId) {
          return reply.status(401).send({ error: 'Unauthorized' });
        }

        const { category } = request.query as { category?: string };

        const updatedPreferences =
          await preferencesService.resetUserPreferences(
            userId,
            category as any
          );
        return { preferences: updatedPreferences };
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({ error: 'Internal server error' });
      }
    }
  );

  // Export preferences
  fastify.get(
    '/preferences/export',
    {
      schema: {
        description: 'Export user preferences',
        tags: ['User Preferences'],
        security: [{ bearerAuth: [] }],
        response: {
          200: {
            type: 'object',
            properties: {
              preferences: { type: 'object' },
              exportedAt: { type: 'string', format: 'date-time' },
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const userId = (request as any).user?.id;
        if (!userId) {
          return reply.status(401).send({ error: 'Unauthorized' });
        }

        const exportData =
          await preferencesService.exportUserPreferences(userId);
        return exportData;
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({ error: 'Internal server error' });
      }
    }
  );

  // Import preferences
  fastify.post(
    '/preferences/import',
    {
      schema: {
        description: 'Import user preferences',
        tags: ['User Preferences'],
        security: [{ bearerAuth: [] }],
        body: {
          type: 'object',
          properties: {
            preferences: { type: 'object' },
            merge: { type: 'boolean', default: true },
          },
          required: ['preferences'],
        },
        response: {
          200: {
            type: 'object',
            properties: {
              preferences: { type: 'object' },
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const userId = (request as any).user?.id;
        if (!userId) {
          return reply.status(401).send({ error: 'Unauthorized' });
        }

        const { preferences, merge = true } = request.body as {
          preferences: any;
          merge?: boolean;
        };

        const updatedPreferences =
          await preferencesService.importUserPreferences(
            userId,
            preferences,
            merge
          );
        return { preferences: updatedPreferences };
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({ error: 'Internal server error' });
      }
    }
  );

  // Get preferences by category
  fastify.get(
    '/preferences/:category',
    {
      schema: {
        description: 'Get preferences by category',
        tags: ['User Preferences'],
        security: [{ bearerAuth: [] }],
        params: {
          type: 'object',
          properties: {
            category: { type: 'string' },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              preferences: {},
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const userId = (request as any).user?.id;
        if (!userId) {
          return reply.status(401).send({ error: 'Unauthorized' });
        }

        const { category } = request.params as { category: string };

        const preferences = await preferencesService.getPreferencesByCategory(
          userId,
          category as any
        );
        return { preferences };
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({ error: 'Internal server error' });
      }
    }
  );
}
