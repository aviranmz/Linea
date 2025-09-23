import { createClient, RedisClientType } from 'redis'
import { getConfig } from '@linea/config'

export interface SessionData {
  userId: string
  email: string
  role: string
  name?: string
  createdAt: number
  expiresAt: number
}

export class SessionService {
  private client: RedisClientType
  private isConnected = false

  constructor() {
    const config = getConfig()
    this.client = createClient({
      url: config.redis.REDIS_URL,
      password: config.redis.REDIS_PASSWORD || undefined,
      database: config.redis.REDIS_DB || 0,
    })

    this.client.on('error', (err) => {
      console.error('Redis Client Error:', err)
    })

    this.client.on('connect', () => {
      console.log('Redis Client Connected')
      this.isConnected = true
    })

    this.client.on('disconnect', () => {
      console.log('Redis Client Disconnected')
      this.isConnected = false
    })
  }

  async connect(): Promise<void> {
    if (!this.isConnected) {
      await this.client.connect()
    }
  }

  async disconnect(): Promise<void> {
    if (this.isConnected) {
      await this.client.disconnect()
    }
  }

  private getKey(token: string): string {
    const config = getConfig()
    const prefix = config.redis.REDIS_KEY_PREFIX || 'linea:'
    return `${prefix}session:${token}`
  }

  async createSession(
    token: string, 
    sessionData: Omit<SessionData, 'createdAt' | 'expiresAt'>,
    expiresInMs: number
  ): Promise<void> {
    await this.connect()
    
    const now = Date.now()
    const expiresAt = now + expiresInMs
    
    const session: SessionData = {
      ...sessionData,
      createdAt: now,
      expiresAt
    }

    const key = this.getKey(token)
    await this.client.setEx(key, Math.ceil(expiresInMs / 1000), JSON.stringify(session))
  }

  async getSession(token: string): Promise<SessionData | null> {
    await this.connect()
    
    const key = this.getKey(token)
    const data = await this.client.get(key)
    
    if (!data) {
      return null
    }

    try {
      const session = JSON.parse(data) as SessionData
      
      // Check if session is expired
      if (Date.now() > session.expiresAt) {
        await this.deleteSession(token)
        return null
      }

      return session
    } catch (error) {
      console.error('Failed to parse session data:', error)
      await this.deleteSession(token)
      return null
    }
  }

  async updateSession(token: string, updates: Partial<SessionData>): Promise<boolean> {
    await this.connect()
    
    const existing = await this.getSession(token)
    if (!existing) {
      return false
    }

    const updated = { ...existing, ...updates }
    const key = this.getKey(token)
    const ttl = Math.ceil((updated.expiresAt - Date.now()) / 1000)
    
    if (ttl <= 0) {
      await this.deleteSession(token)
      return false
    }

    await this.client.setEx(key, ttl, JSON.stringify(updated))
    return true
  }

  async deleteSession(token: string): Promise<void> {
    await this.connect()
    
    const key = this.getKey(token)
    await this.client.del(key)
  }

  async deleteUserSessions(userId: string): Promise<void> {
    await this.connect()
    
    const config = getConfig()
    const prefix = config.redis.REDIS_KEY_PREFIX || 'linea:'
    const pattern = `${prefix}session:*`
    
    const keys = await this.client.keys(pattern)
    const sessionsToDelete: string[] = []
    
    for (const key of keys) {
      const data = await this.client.get(key)
      if (data) {
        try {
          const session = JSON.parse(data) as SessionData
          if (session.userId === userId) {
            sessionsToDelete.push(key)
          }
        } catch (error) {
          // Invalid session data, delete it
          sessionsToDelete.push(key)
        }
      }
    }
    
    if (sessionsToDelete.length > 0) {
      await this.client.del(sessionsToDelete)
    }
  }

  async extendSession(token: string, additionalMs: number): Promise<boolean> {
    await this.connect()
    
    const session = await this.getSession(token)
    if (!session) {
      return false
    }

    const newExpiresAt = session.expiresAt + additionalMs
    return await this.updateSession(token, { expiresAt: newExpiresAt })
  }

  async cleanupExpiredSessions(): Promise<number> {
    await this.connect()
    
    const config = getConfig()
    const prefix = config.redis.REDIS_KEY_PREFIX || 'linea:'
    const pattern = `${prefix}session:*`
    
    const keys = await this.client.keys(pattern)
    const now = Date.now()
    const expiredKeys: string[] = []
    
    for (const key of keys) {
      const data = await this.client.get(key)
      if (data) {
        try {
          const session = JSON.parse(data) as SessionData
          if (now > session.expiresAt) {
            expiredKeys.push(key)
          }
        } catch (error) {
          // Invalid session data, mark for deletion
          expiredKeys.push(key)
        }
      }
    }
    
    if (expiredKeys.length > 0) {
      await this.client.del(expiredKeys)
    }
    
    return expiredKeys.length
  }

  async getSessionCount(): Promise<number> {
    await this.connect()
    
    const config = getConfig()
    const prefix = config.redis.REDIS_KEY_PREFIX || 'linea:'
    const pattern = `${prefix}session:*`
    
    const keys = await this.client.keys(pattern)
    return keys.length
  }

  async isHealthy(): Promise<boolean> {
    try {
      await this.connect()
      await this.client.ping()
      return true
    } catch (error) {
      console.error('Redis health check failed:', error)
      return false
    }
  }
}

// Singleton instance
export const sessionService = new SessionService()
