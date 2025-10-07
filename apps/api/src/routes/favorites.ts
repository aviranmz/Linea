import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { sessionService } from '../services/sessionService.js';

// Import authentication functions from the main API
const getSessionUser = async (request: FastifyRequest) => {
  const cookieName = 'linea_session';
  const token = (request.cookies as Record<string, string | undefined>)?.[
    cookieName
  ];
  if (!token) return null;

  try {
    const session = await sessionService.getSession(token);
    if (!session || !session.userId) return null;

    const prisma = new PrismaClient();
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { id: true, email: true, name: true, role: true, isActive: true },
    });

    if (!user || !user.isActive) return null;
    return user;
  } catch (error) {
    return null;
  }
};

const requireAuth = async (request: FastifyRequest, reply: FastifyReply) => {
  const user = await getSessionUser(request);
  if (!user) {
    reply.code(401).send({ error: 'Authentication required' });
    return null;
  }
  return user;
};

export async function favoritesRoutes(fastify: FastifyInstance) {
  const prisma = new PrismaClient();

  // Get user's favorites
  fastify.get(
    '/api/favorites',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const user = await requireAuth(request, reply);
        if (!user) return;

        const { page = 1, limit = 20 } = request.query as {
          page?: number;
          limit?: number;
        };
        const skip = (page - 1) * limit;

        const [favorites, total] = await Promise.all([
          prisma.favorite.findMany({
            where: { userId: user.id },
            include: {
              event: {
                include: {
                  owner: {
                    select: { id: true, name: true, businessName: true },
                  },
                  venue: {
                    select: { id: true, name: true, city: true, country: true },
                  },
                  category: {
                    select: {
                      id: true,
                      name: true,
                      slug: true,
                      color: true,
                      icon: true,
                    },
                  },
                  _count: {
                    select: { waitlist: true },
                  },
                },
              },
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
          }),
          prisma.favorite.count({ where: { userId: user.id } }),
        ]);

        reply.send({
          favorites: favorites.map((fav: any) => ({
            id: fav.id,
            event: fav.event,
            createdAt: fav.createdAt,
          })),
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        });
      } catch (error) {
        fastify.log.error({ error }, 'Failed to get favorites');
        reply.code(500).send({ error: 'Failed to get favorites' });
      }
    }
  );

  // Add event to favorites
  fastify.post(
    '/api/favorites',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const user = await requireAuth(request, reply);
        if (!user) return;

        const { eventId } = request.body as { eventId: string };
        if (!eventId) {
          reply.code(400).send({ error: 'Event ID is required' });
          return;
        }

        // Check if event exists
        const event = await prisma.event.findUnique({
          where: { id: eventId },
          select: { id: true, title: true, isPublic: true },
        });

        if (!event) {
          reply.code(404).send({ error: 'Event not found' });
          return;
        }

        if (!event.isPublic) {
          reply.code(403).send({ error: 'Cannot favorite private events' });
          return;
        }

        // Check if already favorited
        const existingFavorite = await prisma.favorite.findUnique({
          where: {
            userId_eventId: {
              userId: user.id,
              eventId,
            },
          },
        });

        if (existingFavorite) {
          reply.code(409).send({ error: 'Event already in favorites' });
          return;
        }

        // Add to favorites
        const favorite = await prisma.favorite.create({
          data: {
            userId: user.id,
            eventId,
          },
          include: {
            event: {
              include: {
                owner: {
                  select: { id: true, name: true, businessName: true },
                },
                venue: {
                  select: { id: true, name: true, city: true, country: true },
                },
                category: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                    color: true,
                    icon: true,
                  },
                },
                _count: {
                  select: { waitlist: true },
                },
              },
            },
          },
        });

        reply.code(201).send({
          id: favorite.id,
          event: favorite.event,
          createdAt: favorite.createdAt,
        });
      } catch (error) {
        fastify.log.error({ error }, 'Failed to add favorite');
        reply.code(500).send({ error: 'Failed to add favorite' });
      }
    }
  );

  // Remove event from favorites
  fastify.delete(
    '/api/favorites/:eventId',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const user = await requireAuth(request, reply);
        if (!user) return;

        const { eventId } = request.params as { eventId: string };
        if (!eventId) {
          reply.code(400).send({ error: 'Event ID is required' });
          return;
        }

        const favorite = await prisma.favorite.findUnique({
          where: {
            userId_eventId: {
              userId: user.id,
              eventId,
            },
          },
        });

        if (!favorite) {
          reply.code(404).send({ error: 'Favorite not found' });
          return;
        }

        await prisma.favorite.delete({
          where: { id: favorite.id },
        });

        reply.send({ success: true });
      } catch (error) {
        fastify.log.error({ error }, 'Failed to remove favorite');
        reply.code(500).send({ error: 'Failed to remove favorite' });
      }
    }
  );

  // Check if event is favorited
  fastify.get(
    '/api/favorites/:eventId',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const user = await requireAuth(request, reply);
        if (!user) return;

        const { eventId } = request.params as { eventId: string };
        if (!eventId) {
          reply.code(400).send({ error: 'Event ID is required' });
          return;
        }

        const favorite = await prisma.favorite.findUnique({
          where: {
            userId_eventId: {
              userId: user.id,
              eventId,
            },
          },
        });

        reply.send({
          isFavorited: !!favorite,
          favoriteId: favorite?.id || null,
        });
      } catch (error) {
        fastify.log.error({ error }, 'Failed to check favorite status');
        reply.code(500).send({ error: 'Failed to check favorite status' });
      }
    }
  );

  // Toggle favorite status
  fastify.post(
    '/api/favorites/:eventId/toggle',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const user = await requireAuth(request, reply);
        if (!user) return;

        const { eventId } = request.params as { eventId: string };
        if (!eventId) {
          reply.code(400).send({ error: 'Event ID is required' });
          return;
        }

        // Check if event exists and is public
        const event = await prisma.event.findUnique({
          where: { id: eventId },
          select: { id: true, title: true, isPublic: true },
        });

        if (!event) {
          reply.code(404).send({ error: 'Event not found' });
          return;
        }

        if (!event.isPublic) {
          reply.code(403).send({ error: 'Cannot favorite private events' });
          return;
        }

        // Check if already favorited
        const existingFavorite = await prisma.favorite.findUnique({
          where: {
            userId_eventId: {
              userId: user.id,
              eventId,
            },
          },
        });

        if (existingFavorite) {
          // Remove from favorites
          await prisma.favorite.delete({
            where: { id: existingFavorite.id },
          });

          reply.send({
            isFavorited: false,
            action: 'removed',
          });
        } else {
          // Add to favorites
          const favorite = await prisma.favorite.create({
            data: {
              userId: user.id,
              eventId,
            },
          });

          reply.send({
            isFavorited: true,
            action: 'added',
            favoriteId: favorite.id,
          });
        }
      } catch (error) {
        fastify.log.error({ error }, 'Failed to toggle favorite');
        reply.code(500).send({ error: 'Failed to toggle favorite' });
      }
    }
  );
}
