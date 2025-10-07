// Message service with fallback, retry, and chunking logic
import {
  MessageAdapter,
  Message,
  MessageResult,
  MessageChannel,
} from '../adapters/messageAdapters.js';
import { EmailAdapter } from '../adapters/messageAdapters.js';
import { TelegramAdapter } from '../adapters/messageAdapters.js';
import { WhatsAppAdapter } from '../adapters/messageAdapters.js';
import { SMSAdapter } from '../adapters/messageAdapters.js';

export interface MessageServiceConfig {
  email?: {
    apiKey: string;
    fromEmail: string;
    fromName: string;
  };
  telegram?: {
    botToken: string;
    chatId: string;
  };
  whatsapp?: {
    accountSid: string;
    authToken: string;
    fromNumber: string;
  };
  sms?: {
    accountSid: string;
    authToken: string;
    fromNumber: string;
  };
  retryConfig?: {
    maxRetries: number;
    retryDelay: number;
    backoffMultiplier: number;
  };
  chunkingConfig?: {
    maxLength: number;
    splitOn: string;
  };
}

export class MessageService {
  private adapters: Map<MessageChannel, MessageAdapter> = new Map();
  private retryConfig: Required<MessageServiceConfig['retryConfig']>;
  private chunkingConfig: Required<MessageServiceConfig['chunkingConfig']>;

  constructor(config: MessageServiceConfig) {
    this.retryConfig = {
      maxRetries: 3,
      retryDelay: 1000,
      backoffMultiplier: 2,
      ...config.retryConfig,
    };

    this.chunkingConfig = {
      maxLength: 4000,
      splitOn: '\n',
      ...config.chunkingConfig,
    };

    // Initialize adapters
    if (config.email) {
      this.adapters.set(
        MessageChannel.EMAIL,
        new EmailAdapter(
          config.email.apiKey,
          config.email.fromEmail,
          config.email.fromName
        )
      );
    }

    if (config.telegram) {
      this.adapters.set(
        MessageChannel.TELEGRAM,
        new TelegramAdapter(config.telegram.botToken, config.telegram.chatId)
      );
    }

    if (config.whatsapp) {
      this.adapters.set(
        MessageChannel.WHATSAPP,
        new WhatsAppAdapter(
          config.whatsapp.accountSid,
          config.whatsapp.authToken,
          config.whatsapp.fromNumber
        )
      );
    }

    if (config.sms) {
      this.adapters.set(
        MessageChannel.SMS,
        new SMSAdapter(
          config.sms.accountSid,
          config.sms.authToken,
          config.sms.fromNumber
        )
      );
    }
  }

  async sendMessage(message: Message): Promise<MessageResult[]> {
    const results: MessageResult[] = [];

    // Get available adapters for the channel
    const availableAdapters = await this.getAvailableAdapters(message.channel);

    if (availableAdapters.length === 0) {
      return [
        {
          success: false,
          error: `No available adapters for channel: ${message.channel}`,
          channel: message.channel,
          timestamp: new Date(),
        },
      ];
    }

    // Chunk message if needed
    const chunks = this.chunkMessage(message);

    for (const chunk of chunks) {
      let lastError: string | undefined;

      // Try each adapter in order of preference
      for (const adapter of availableAdapters) {
        try {
          const result = await this.sendWithRetry(adapter, chunk);
          results.push(result);

          if (result.success) {
            break; // Success, move to next chunk
          } else {
            lastError = result.error;
          }
        } catch (error) {
          lastError = error instanceof Error ? error.message : 'Unknown error';
        }
      }

      // If all adapters failed for this chunk
      if (!results[results.length - 1]?.success) {
        results.push({
          success: false,
          error: lastError || 'All adapters failed',
          channel: message.channel,
          timestamp: new Date(),
        });
      }
    }

    return results;
  }

  private async sendWithRetry(
    adapter: MessageAdapter,
    message: Message
  ): Promise<MessageResult> {
    let lastError: string | undefined;
    let retryCount = 0;

    while (retryCount <= (this.retryConfig?.maxRetries || 3)) {
      try {
        const result = await adapter.send(message);

        if (result.success) {
          return { ...result, retryCount };
        } else {
          lastError = result.error;
        }
      } catch (error) {
        lastError = error instanceof Error ? error.message : 'Unknown error';
      }

      if (retryCount < (this.retryConfig?.maxRetries || 3)) {
        const delay =
          (this.retryConfig?.retryDelay || 1000) *
          Math.pow(this.retryConfig?.backoffMultiplier || 2, retryCount);
        await this.sleep(delay);
        retryCount++;
      } else {
        break;
      }
    }

    return {
      success: false,
      error: lastError || 'Max retries exceeded',
      channel: adapter.getChannelName(),
      timestamp: new Date(),
      retryCount,
    };
  }

  private async getAvailableAdapters(
    channel: MessageChannel
  ): Promise<MessageAdapter[]> {
    const adapters: MessageAdapter[] = [];

    // Primary channel
    const primaryAdapter = this.adapters.get(channel);
    if (primaryAdapter && (await primaryAdapter.isAvailable())) {
      adapters.push(primaryAdapter);
    }

    // Fallback channels based on priority
    const fallbackChannels = this.getFallbackChannels(channel);

    for (const fallbackChannel of fallbackChannels) {
      const adapter = this.adapters.get(fallbackChannel);
      if (adapter && (await adapter.isAvailable())) {
        adapters.push(adapter);
      }
    }

    return adapters;
  }

  private getFallbackChannels(channel: MessageChannel): MessageChannel[] {
    // Define fallback priority for each channel
    const fallbackMap: Record<MessageChannel, MessageChannel[]> = {
      [MessageChannel.EMAIL]: [
        MessageChannel.TELEGRAM,
        MessageChannel.WHATSAPP,
        MessageChannel.SMS,
      ],
      [MessageChannel.TELEGRAM]: [
        MessageChannel.WHATSAPP,
        MessageChannel.EMAIL,
        MessageChannel.SMS,
      ],
      [MessageChannel.WHATSAPP]: [
        MessageChannel.SMS,
        MessageChannel.TELEGRAM,
        MessageChannel.EMAIL,
      ],
      [MessageChannel.SMS]: [
        MessageChannel.WHATSAPP,
        MessageChannel.TELEGRAM,
        MessageChannel.EMAIL,
      ],
    };

    return fallbackMap[channel] || [];
  }

  private chunkMessage(message: Message): Message[] {
    if (message.content.length <= (this.chunkingConfig?.maxLength || 1000)) {
      return [message];
    }

    const chunks: Message[] = [];
    const content = message.content;
    const splitPoints = content.split(this.chunkingConfig?.splitOn || '\n');

    let currentChunk = '';
    let chunkIndex = 1;

    for (const part of splitPoints) {
      if (
        currentChunk.length + part.length + 1 <=
        (this.chunkingConfig?.maxLength || 1000)
      ) {
        currentChunk +=
          (currentChunk ? this.chunkingConfig?.splitOn || '\n' : '') + part;
      } else {
        if (currentChunk) {
          chunks.push({
            ...message,
            content: currentChunk,
            metadata: {
              ...message.metadata,
              chunkIndex,
              totalChunks: 0, // Will be set after all chunks are created
            },
          });
          chunkIndex++;
        }
        currentChunk = part;
      }
    }

    if (currentChunk) {
      chunks.push({
        ...message,
        content: currentChunk,
        metadata: {
          ...message.metadata,
          chunkIndex,
          totalChunks: 0, // Will be set after all chunks are created
        },
      });
    }

    // Set total chunks for all chunks
    const totalChunks = chunks.length;
    chunks.forEach(chunk => {
      if (chunk.metadata) {
        chunk.metadata.totalChunks = totalChunks;
      }
    });

    return chunks;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getServiceStatus(): Promise<Record<string, boolean>> {
    const status: Record<string, boolean> = {};

    for (const [channel, adapter] of this.adapters) {
      status[channel] = await adapter.isAvailable();
    }

    return status;
  }

  getAvailableChannels(): MessageChannel[] {
    return Array.from(this.adapters.keys());
  }
}
