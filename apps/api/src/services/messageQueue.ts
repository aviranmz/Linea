// Message queue system for handling bulk messages and rate limiting
import { Message, MessageChannel, MessagePriority } from '../adapters/messageAdapters.js'
import { MessageService } from './messageService.js'

export interface QueuedMessage extends Message {
  id: string
  queuedAt: Date
  priority: MessagePriority
  attempts: number
  maxAttempts: number
  nextRetryAt?: Date
}

export interface QueueConfig {
  maxConcurrent: number
  rateLimitPerMinute: number
  batchSize: number
  retryDelay: number
  maxRetries: number
}

export class MessageQueue {
  private queue: QueuedMessage[] = []
  private processing: Set<string> = new Set()
  private messageService: MessageService
  private config: QueueConfig
  private isProcessing = false
  private rateLimitTracker: Map<string, number[]> = new Map()

  constructor(messageService: MessageService, config: Partial<QueueConfig> = {}) {
    this.messageService = messageService
    this.config = {
      maxConcurrent: 5,
      rateLimitPerMinute: 60,
      batchSize: 10,
      retryDelay: 5000,
      maxRetries: 3,
      ...config
    }
  }

  async enqueue(message: Message, priority: MessagePriority = MessagePriority.NORMAL): Promise<string> {
    const queuedMessage: QueuedMessage = {
      ...message,
      id: this.generateId(),
      queuedAt: new Date(),
      priority,
      attempts: 0,
      maxAttempts: this.config.maxRetries
    }

    this.queue.push(queuedMessage)
    this.sortQueueByPriority()
    
    // Start processing if not already running
    if (!this.isProcessing) {
      this.processQueue()
    }

    return queuedMessage.id
  }

  async enqueueBatch(messages: Message[], priority: MessagePriority = MessagePriority.NORMAL): Promise<string[]> {
    const ids: string[] = []
    
    for (const message of messages) {
      const id = await this.enqueue(message, priority)
      ids.push(id)
    }
    
    return ids
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessing) return
    
    this.isProcessing = true

    try {
      while (this.queue.length > 0 && this.processing.size < this.config.maxConcurrent) {
        const message = this.queue.shift()
        if (!message) break

        // Check if message is ready for processing
        if (message.nextRetryAt && message.nextRetryAt > new Date()) {
          this.queue.push(message) // Put it back
          continue
        }

        this.processing.add(message.id)
        this.processMessage(message).finally(() => {
          this.processing.delete(message.id)
        })
      }
    } finally {
      this.isProcessing = false
    }
  }

  private async processMessage(message: QueuedMessage): Promise<void> {
    try {
      // Check rate limiting
      if (!this.checkRateLimit(message.channel)) {
        // Reschedule for later
        message.nextRetryAt = new Date(Date.now() + 60000) // 1 minute
        this.queue.push(message)
        return
      }

      const results = await this.messageService.sendMessage(message)
      const success = results.some(result => result.success)

      if (success) {
        console.log(`Message ${message.id} sent successfully`)
      } else {
        await this.handleFailedMessage(message)
      }
    } catch (error) {
      console.error(`Error processing message ${message.id}:`, error)
      await this.handleFailedMessage(message)
    }
  }

  private async handleFailedMessage(message: QueuedMessage): Promise<void> {
    message.attempts++
    
    if (message.attempts < message.maxAttempts) {
      // Schedule retry
      const delay = this.config.retryDelay * Math.pow(2, message.attempts - 1) // Exponential backoff
      message.nextRetryAt = new Date(Date.now() + delay)
      this.queue.push(message)
      console.log(`Message ${message.id} scheduled for retry ${message.attempts}/${message.maxAttempts}`)
    } else {
      console.error(`Message ${message.id} failed after ${message.attempts} attempts`)
      // Could send to dead letter queue or alert administrators
    }
  }

  private checkRateLimit(channel: MessageChannel): boolean {
    const now = Date.now()
    const minuteAgo = now - 60000
    const channelKey = channel.toString()
    
    const timestamps = this.rateLimitTracker.get(channelKey) || []
    const recentTimestamps = timestamps.filter(timestamp => timestamp > minuteAgo)
    
    if (recentTimestamps.length >= this.config.rateLimitPerMinute) {
      return false
    }
    
    recentTimestamps.push(now)
    this.rateLimitTracker.set(channelKey, recentTimestamps)
    
    return true
  }

  private sortQueueByPriority(): void {
    const priorityOrder = {
      [MessagePriority.URGENT]: 0,
      [MessagePriority.HIGH]: 1,
      [MessagePriority.NORMAL]: 2,
      [MessagePriority.LOW]: 3
    }

    this.queue.sort((a, b) => {
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority]
      if (priorityDiff !== 0) return priorityDiff
      return a.queuedAt.getTime() - b.queuedAt.getTime()
    })
  }

  private generateId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  getQueueStatus(): {
    total: number
    processing: number
    waiting: number
    byPriority: Record<MessagePriority, number>
  } {
    const byPriority = {
      [MessagePriority.URGENT]: 0,
      [MessagePriority.HIGH]: 0,
      [MessagePriority.NORMAL]: 0,
      [MessagePriority.LOW]: 0
    }

    for (const message of this.queue) {
      byPriority[message.priority]++
    }

    return {
      total: this.queue.length,
      processing: this.processing.size,
      waiting: this.queue.length - this.processing.size,
      byPriority
    }
  }

  async clearQueue(): Promise<void> {
    this.queue = []
    this.processing.clear()
  }

  async pauseQueue(): Promise<void> {
    this.isProcessing = false
  }

  async resumeQueue(): Promise<void> {
    if (this.queue.length > 0) {
      this.processQueue()
    }
  }
}
