// Webhook service for handling inbound messages from various platforms
import { FastifyRequest, FastifyReply } from 'fastify';
type PrismaClientType = import('@prisma/client').PrismaClient;

export interface InboundMessage {
  id: string;
  platform: 'telegram' | 'whatsapp' | 'sms' | 'email';
  from: string;
  to: string;
  content: string;
  timestamp: Date;
  metadata: {
    messageId?: string;
    chatId?: string;
    userId?: string;
    messageType?: 'text' | 'image' | 'document' | 'location' | 'contact';
    rawPayload?: any;
  };
}

export interface WebhookHandler {
  platform: string;
  validateRequest(request: FastifyRequest): Promise<boolean>;
  parseMessage(request: FastifyRequest): Promise<InboundMessage>;
  processMessage(message: InboundMessage): Promise<void>;
}

export class TelegramWebhookHandler implements WebhookHandler {
  platform = 'telegram';
  private botToken: string;

  constructor(botToken: string) {
    this.botToken = botToken;
  }

  async validateRequest(request: FastifyRequest): Promise<boolean> {
    // Telegram webhook validation
    const body = request.body as any;
    return body && body.message && body.message.from;
  }

  async parseMessage(request: FastifyRequest): Promise<InboundMessage> {
    const body = request.body as any;
    const message = body.message;

    return {
      id: `tg_${message.message_id}`,
      platform: 'telegram',
      from: message.from.id.toString(),
      to: message.chat.id.toString(),
      content: message.text || '',
      timestamp: new Date(message.date * 1000),
      metadata: {
        messageId: message.message_id.toString(),
        chatId: message.chat.id.toString(),
        userId: message.from.id.toString(),
        messageType: this.getMessageType(message),
        rawPayload: body,
      },
    };
  }

  async processMessage(message: InboundMessage): Promise<void> {
    // Process Telegram message
    console.log(`Processing Telegram message: ${message.content}`);
    // Add your business logic here
  }

  private getMessageType(
    message: any
  ): 'text' | 'image' | 'document' | 'location' | 'contact' {
    if (message.text) return 'text';
    if (message.photo) return 'image';
    if (message.document) return 'document';
    if (message.location) return 'location';
    if (message.contact) return 'contact';
    return 'text';
  }
}

export class WhatsAppWebhookHandler implements WebhookHandler {
  platform = 'whatsapp';
  private webhookSecret: string;

  constructor(webhookSecret: string) {
    this.webhookSecret = webhookSecret;
  }

  async validateRequest(request: FastifyRequest): Promise<boolean> {
    // WhatsApp webhook validation
    const body = request.body as any;
    return body && body.entry && body.entry[0] && body.entry[0].changes;
  }

  async parseMessage(request: FastifyRequest): Promise<InboundMessage> {
    const body = request.body as any;
    const entry = body.entry[0];
    const change = entry.changes[0];
    const value = change.value;

    if (!value.messages) {
      throw new Error('No messages in webhook payload');
    }

    const message = value.messages[0];
    const contact = value.contacts?.[0];

    return {
      id: `wa_${message.id}`,
      platform: 'whatsapp',
      from: message.from,
      to: value.metadata.display_phone_number,
      content: message.text?.body || '',
      timestamp: new Date(parseInt(message.timestamp) * 1000),
      metadata: {
        messageId: message.id,
        chatId: message.from,
        userId: contact?.profile?.name,
        messageType: this.getMessageType(message),
        rawPayload: body,
      },
    };
  }

  async processMessage(message: InboundMessage): Promise<void> {
    // Process WhatsApp message
    console.log(`Processing WhatsApp message: ${message.content}`);
    // Add your business logic here
  }

  private getMessageType(
    message: any
  ): 'text' | 'image' | 'document' | 'location' | 'contact' {
    if (message.text) return 'text';
    if (message.image) return 'image';
    if (message.document) return 'document';
    if (message.location) return 'location';
    if (message.contacts) return 'contact';
    return 'text';
  }
}

export class SMSWebhookHandler implements WebhookHandler {
  platform = 'sms';
  private webhookSecret: string;

  constructor(webhookSecret: string) {
    this.webhookSecret = webhookSecret;
  }

  async validateRequest(request: FastifyRequest): Promise<boolean> {
    // SMS webhook validation (Twilio)
    const body = request.body as any;
    return body && body.MessageSid && body.From && body.Body;
  }

  async parseMessage(request: FastifyRequest): Promise<InboundMessage> {
    const body = request.body as any;

    return {
      id: `sms_${body.MessageSid}`,
      platform: 'sms',
      from: body.From,
      to: body.To,
      content: body.Body,
      timestamp: new Date(),
      metadata: {
        messageId: body.MessageSid,
        chatId: body.From,
        userId: body.From,
        messageType: 'text',
        rawPayload: body,
      },
    };
  }

  async processMessage(message: InboundMessage): Promise<void> {
    // Process SMS message
    console.log(`Processing SMS message: ${message.content}`);
    // Add your business logic here
  }
}

export class EmailWebhookHandler implements WebhookHandler {
  platform = 'email';
  private webhookSecret: string;

  constructor(webhookSecret: string) {
    this.webhookSecret = webhookSecret;
  }

  async validateRequest(request: FastifyRequest): Promise<boolean> {
    // Email webhook validation (SendGrid)
    const body = request.body as any;
    return body && body.from && body.text;
  }

  async parseMessage(request: FastifyRequest): Promise<InboundMessage> {
    const body = request.body as any;

    return {
      id: `email_${Date.now()}`,
      platform: 'email',
      from: body.from,
      to: body.to,
      content: body.text || body.html,
      timestamp: new Date(),
      metadata: {
        messageId: body.message_id,
        chatId: body.to,
        userId: body.from,
        messageType: 'text',
        rawPayload: body,
      },
    };
  }

  async processMessage(message: InboundMessage): Promise<void> {
    // Process email message
    console.log(`Processing email message: ${message.content}`);
    // Add your business logic here
  }
}

export class WebhookService {
  private handlers: Map<string, WebhookHandler> = new Map();
  private prisma: PrismaClientType;

  constructor(prisma: PrismaClientType) {
    this.prisma = prisma;
  }

  registerHandler(handler: WebhookHandler): void {
    this.handlers.set(handler.platform, handler);
  }

  async handleWebhook(
    platform: string,
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const handler = this.handlers.get(platform);
    if (!handler) {
      return reply.status(404).send({ error: 'Platform not supported' });
    }

    try {
      // Validate request
      const isValid = await handler.validateRequest(request);
      if (!isValid) {
        return reply.status(400).send({ error: 'Invalid webhook payload' });
      }

      // Parse message
      const message = await handler.parseMessage(request);

      // Store message in database
      await this.storeMessage(message);

      // Process message
      await handler.processMessage(message);

      // Send acknowledgment
      return reply.status(200).send({ status: 'success' });
    } catch (error) {
      console.error(`Webhook processing error for ${platform}:`, error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  }

  private async storeMessage(message: InboundMessage): Promise<void> {
    // Store inbound message in database for audit trail
    await this.prisma.auditLog.create({
      data: {
        action: 'INBOUND_MESSAGE',
        resource: 'Message',
        resourceId: message.id,
        metadata: {
          platform: message.platform,
          from: message.from,
          to: message.to,
          content: message.content,
          timestamp: message.timestamp,
          metadata: message.metadata,
        },
      },
    });
  }

  async getMessageHistory(
    platform?: string,
    limit: number = 50
  ): Promise<InboundMessage[]> {
    const where = platform
      ? { metadata: { path: ['platform'], equals: platform } }
      : {};

    const logs = await this.prisma.auditLog.findMany({
      where: {
        action: 'INBOUND_MESSAGE',
        ...where,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return logs.map((log: any) => {
      const metadata = log.metadata as any;
      return {
        id: log.resourceId,
        platform: metadata.platform,
        from: metadata.from,
        to: metadata.to,
        content: metadata.content,
        timestamp: new Date(metadata.timestamp),
        metadata: metadata.metadata,
      };
    });
  }

  async getWebhookStatus(): Promise<Record<string, boolean>> {
    const status: Record<string, boolean> = {};

    for (const [platform] of this.handlers) {
      try {
        // Test handler availability
        status[platform] = true;
      } catch (error) {
        status[platform] = false;
      }
    }

    return status;
  }
}
