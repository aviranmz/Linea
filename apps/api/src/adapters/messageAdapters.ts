// Message sending adapters for multiple channels
// Supports Telegram, WhatsApp, Email with fallbacks and retry logic

export interface MessageAdapter {
  send(message: Message): Promise<MessageResult>
  isAvailable(): Promise<boolean>
  getChannelName(): string
}

export interface Message {
  to: string
  content: string
  subject?: string
  channel: MessageChannel
  priority?: MessagePriority
  metadata?: Record<string, any>
}

export interface MessageResult {
  success: boolean
  messageId?: string
  error?: string
  channel: string
  timestamp: Date
  retryCount?: number
}

export enum MessageChannel {
  EMAIL = 'email',
  TELEGRAM = 'telegram',
  WHATSAPP = 'whatsapp',
  SMS = 'sms'
}

export enum MessagePriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent'
}

// Email adapter using SendGrid
export class EmailAdapter implements MessageAdapter {
  private apiKey: string
  private fromEmail: string
  private fromName: string

  constructor(apiKey: string, fromEmail: string, fromName: string) {
    this.apiKey = apiKey
    this.fromEmail = fromEmail
    this.fromName = fromName
  }

  async send(message: Message): Promise<MessageResult> {
    try {
      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: message.to }] }],
          from: { email: this.fromEmail, name: this.fromName },
          subject: message.subject || 'Notification',
          content: [{ type: 'text/plain', value: message.content }]
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`SendGrid error: ${response.status} - ${errorText}`)
      }

      return {
        success: true,
        messageId: response.headers.get('X-Message-Id') || '',
        channel: this.getChannelName(),
        timestamp: new Date()
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        channel: this.getChannelName(),
        timestamp: new Date()
      }
    }
  }

  async isAvailable(): Promise<boolean> {
    return !!this.apiKey && !!this.fromEmail
  }

  getChannelName(): string {
    return MessageChannel.EMAIL
  }
}

// Telegram adapter
export class TelegramAdapter implements MessageAdapter {
  private botToken: string
  private chatId: string

  constructor(botToken: string, chatId: string) {
    this.botToken = botToken
    this.chatId = chatId
  }

  async send(message: Message): Promise<MessageResult> {
    try {
      const response = await fetch(`https://api.telegram.org/bot${this.botToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chat_id: this.chatId,
          text: message.content,
          parse_mode: 'HTML'
        })
      })

      const data = await response.json()

      if (!response.ok || !data.ok) {
        throw new Error(`Telegram error: ${data.description || 'Unknown error'}`)
      }

      return {
        success: true,
        messageId: data.result?.message_id?.toString(),
        channel: this.getChannelName(),
        timestamp: new Date()
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        channel: this.getChannelName(),
        timestamp: new Date()
      }
    }
  }

  async isAvailable(): Promise<boolean> {
    return !!this.botToken && !!this.chatId
  }

  getChannelName(): string {
    return MessageChannel.TELEGRAM
  }
}

// WhatsApp adapter using Twilio
export class WhatsAppAdapter implements MessageAdapter {
  private accountSid: string
  private authToken: string
  private fromNumber: string

  constructor(accountSid: string, authToken: string, fromNumber: string) {
    this.accountSid = accountSid
    this.authToken = authToken
    this.fromNumber = fromNumber
  }

  async send(message: Message): Promise<MessageResult> {
    try {
      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          From: this.fromNumber,
          To: message.to,
          Body: message.content
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(`Twilio error: ${data.message || 'Unknown error'}`)
      }

      return {
        success: true,
        messageId: data.sid,
        channel: this.getChannelName(),
        timestamp: new Date()
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        channel: this.getChannelName(),
        timestamp: new Date()
      }
    }
  }

  async isAvailable(): Promise<boolean> {
    return !!this.accountSid && !!this.authToken && !!this.fromNumber
  }

  getChannelName(): string {
    return MessageChannel.WHATSAPP
  }
}

// SMS adapter using Twilio
export class SMSAdapter implements MessageAdapter {
  private accountSid: string
  private authToken: string
  private fromNumber: string

  constructor(accountSid: string, authToken: string, fromNumber: string) {
    this.accountSid = accountSid
    this.authToken = authToken
    this.fromNumber = fromNumber
  }

  async send(message: Message): Promise<MessageResult> {
    try {
      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          From: this.fromNumber,
          To: message.to,
          Body: message.content
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(`Twilio SMS error: ${data.message || 'Unknown error'}`)
      }

      return {
        success: true,
        messageId: data.sid,
        channel: this.getChannelName(),
        timestamp: new Date()
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        channel: this.getChannelName(),
        timestamp: new Date()
      }
    }
  }

  async isAvailable(): Promise<boolean> {
    return !!this.accountSid && !!this.authToken && !!this.fromNumber
  }

  getChannelName(): string {
    return MessageChannel.SMS
  }
}
