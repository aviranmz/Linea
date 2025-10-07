// Webhook routes for handling inbound messages
import { FastifyInstance } from 'fastify';
import {
  WebhookService,
  TelegramWebhookHandler,
  WhatsAppWebhookHandler,
  SMSWebhookHandler,
  EmailWebhookHandler,
} from '../services/webhookService.js';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;

export async function webhookRoutes(fastify: FastifyInstance) {
  const prisma = new PrismaClient();
  const webhookService = new WebhookService(prisma);

  // Initialize webhook handlers
  const telegramHandler = new TelegramWebhookHandler(
    process.env.TELEGRAM_BOT_TOKEN || ''
  );
  const whatsappHandler = new WhatsAppWebhookHandler(
    process.env.WHATSAPP_WEBHOOK_SECRET || ''
  );
  const smsHandler = new SMSWebhookHandler(
    process.env.TWILIO_WEBHOOK_SECRET || ''
  );
  const emailHandler = new EmailWebhookHandler(
    process.env.SENDGRID_WEBHOOK_SECRET || ''
  );

  // Register handlers
  webhookService.registerHandler(telegramHandler);
  webhookService.registerHandler(whatsappHandler);
  webhookService.registerHandler(smsHandler);
  webhookService.registerHandler(emailHandler);

  // Telegram webhook
  fastify.post(
    '/webhooks/telegram',
    {
      schema: {
        description: 'Telegram webhook endpoint',
        tags: ['Webhooks'],
        response: {
          200: {
            type: 'object',
            properties: {
              status: { type: 'string' },
            },
          },
        },
      },
    },
    async (request, reply) => {
      return webhookService.handleWebhook('telegram', request, reply);
    }
  );

  // WhatsApp webhook
  fastify.post(
    '/webhooks/whatsapp',
    {
      schema: {
        description: 'WhatsApp webhook endpoint',
        tags: ['Webhooks'],
        response: {
          200: {
            type: 'object',
            properties: {
              status: { type: 'string' },
            },
          },
        },
      },
    },
    async (request, reply) => {
      return webhookService.handleWebhook('whatsapp', request, reply);
    }
  );

  // SMS webhook (Twilio)
  fastify.post(
    '/webhooks/sms',
    {
      schema: {
        description: 'SMS webhook endpoint',
        tags: ['Webhooks'],
        response: {
          200: {
            type: 'object',
            properties: {
              status: { type: 'string' },
            },
          },
        },
      },
    },
    async (request, reply) => {
      return webhookService.handleWebhook('sms', request, reply);
    }
  );

  // Email webhook (SendGrid)
  fastify.post(
    '/webhooks/email',
    {
      schema: {
        description: 'Email webhook endpoint',
        tags: ['Webhooks'],
        response: {
          200: {
            type: 'object',
            properties: {
              status: { type: 'string' },
            },
          },
        },
      },
    },
    async (request, reply) => {
      return webhookService.handleWebhook('email', request, reply);
    }
  );

  // Generic webhook endpoint
  fastify.post(
    '/webhooks/:platform',
    {
      schema: {
        description: 'Generic webhook endpoint',
        tags: ['Webhooks'],
        params: {
          type: 'object',
          properties: {
            platform: { type: 'string' },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              status: { type: 'string' },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const { platform } = request.params as { platform: string };
      return webhookService.handleWebhook(platform, request, reply);
    }
  );

  // Get webhook status
  fastify.get(
    '/webhooks/status',
    {
      schema: {
        description: 'Get webhook service status',
        tags: ['Webhooks'],
        response: {
          200: {
            type: 'object',
            properties: {
              status: { type: 'object' },
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const status = await webhookService.getWebhookStatus();
        return { status };
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({ error: 'Internal server error' });
      }
    }
  );

  // Get message history
  fastify.get(
    '/webhooks/messages',
    {
      schema: {
        description: 'Get inbound message history',
        tags: ['Webhooks'],
        querystring: {
          type: 'object',
          properties: {
            platform: { type: 'string' },
            limit: { type: 'number', default: 50 },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              messages: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    platform: { type: 'string' },
                    from: { type: 'string' },
                    to: { type: 'string' },
                    content: { type: 'string' },
                    timestamp: { type: 'string', format: 'date-time' },
                    metadata: { type: 'object' },
                  },
                },
              },
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const { platform, limit } = request.query as {
          platform?: string;
          limit?: number;
        };
        const messages = await webhookService.getMessageHistory(
          platform,
          limit
        );
        return { messages };
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({ error: 'Internal server error' });
      }
    }
  );

  // Webhook verification endpoints
  fastify.get(
    '/webhooks/telegram/verify',
    {
      schema: {
        description: 'Telegram webhook verification',
        tags: ['Webhooks'],
        querystring: {
          type: 'object',
          properties: {
            token: { type: 'string' },
          },
        },
      },
    },
    async (request, reply) => {
      const { token } = request.query as { token: string };

      if (token === process.env.TELEGRAM_BOT_TOKEN) {
        return reply.status(200).send({ verified: true });
      } else {
        return reply.status(401).send({ verified: false });
      }
    }
  );

  fastify.get(
    '/webhooks/whatsapp/verify',
    {
      schema: {
        description: 'WhatsApp webhook verification',
        tags: ['Webhooks'],
        querystring: {
          type: 'object',
          properties: {
            'hub.mode': { type: 'string' },
            'hub.challenge': { type: 'string' },
            'hub.verify_token': { type: 'string' },
          },
        },
      },
    },
    async (request, reply) => {
      const {
        'hub.mode': mode,
        'hub.challenge': challenge,
        'hub.verify_token': token,
      } = request.query as any;

      if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
        return reply.status(200).send(challenge);
      } else {
        return reply.status(403).send({ error: 'Verification failed' });
      }
    }
  );

  // Health check for webhooks
  fastify.get(
    '/webhooks/health',
    {
      schema: {
        description: 'Webhook service health check',
        tags: ['Webhooks'],
        response: {
          200: {
            type: 'object',
            properties: {
              status: { type: 'string' },
              handlers: { type: 'object' },
              uptime: { type: 'number' },
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const status = await webhookService.getWebhookStatus();
        const uptime = process.uptime();

        return {
          status: 'healthy',
          handlers: status,
          uptime,
        };
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({
          status: 'unhealthy',
          error: 'Internal server error',
        });
      }
    }
  );
}
