import { createClient } from 'redis'
type RedisClientType = ReturnType<typeof createClient>
type RedisClientOptions = Parameters<typeof createClient>[0]
import { getConfig } from '@linea/config'

export interface SessionData {
  userId: string
  email: string
  role: string
  name?: string | null
  createdAt: number
  expiresAt: number
}

export class SessionService {
  private client: RedisClientType | null
  private isConnected = false
  // In-memory fallback for development when Redis is unavailable
  private memoryStore: Map<string, SessionData> | null = null

  constructor() {
    const config = getConfig()
    
    // Check if Redis URL is available
    if (!config.redis.REDIS_URL || config.redis.REDIS_URL.includes('production-redis')) {
      console.warn('Redis not configured, using in-memory sessions (dev only)')
      this.client = null
      this.memoryStore = new Map<string, SessionData>()
      return
    }
    
    const clientOptions: RedisClientOptions = {
      url: config.redis.REDIS_URL,
      database: (config.redis.REDIS_DB as number | undefined) || 0,
    }
    
    if (config.redis.REDIS_PASSWORD) {
      clientOptions.password = config.redis.REDIS_PASSWORD
    }
    
    this.client = createClient(clientOptions)

    this.client.on('error', (err) => {
      console.error('Redis Client Error:', err)
    })

    this.client.on('connect', () => {
      console.log('Redis Client Connected')
      this.isConnected = true
    })

    this.client.on('end', () => {
      console.log('Redis Client Disconnected')
      this.isConnected = false
    })
  }

  async connect(): Promise<void> {
    if (!this.client) return
    if (!this.isConnected) {
      await this.client.connect()
    }
  }

  async disconnect(): Promise<void> {
    if (!this.client) return
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
    if (!this.client) {
      // In-memory fallback
      if (!this.memoryStore) this.memoryStore = new Map<string, SessionData>()
      const now = Date.now()
      const expiresAt = now + expiresInMs
      const session: SessionData = { ...sessionData, createdAt: now, expiresAt }
      this.memoryStore.set(this.getKey(token), session)
      return
    }
    
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
    if (!this.client) {
      // In-memory fallback
      const key = this.getKey(token)
      const session = this.memoryStore?.get(key) || null
      if (session && Date.now() > session.expiresAt) {
        this.memoryStore?.delete(key)
        return null
      }
      return session
    }
    
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
    if (!this.client) {
      const key = this.getKey(token)
      const existing = this.memoryStore?.get(key)
      if (!existing) return false
      const updated = { ...existing, ...updates }
      if (Date.now() > updated.expiresAt) {
        this.memoryStore?.delete(key)
        return false
      }
      this.memoryStore?.set(key, updated)
      return true
    }
    
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
    if (!this.client) {
      this.memoryStore?.delete(this.getKey(token))
      return
    }
    
    await this.connect()
    
    const key = this.getKey(token)
    await this.client.del(key)
  }

  async deleteUserSessions(userId: string): Promise<void> {
    if (!this.client) {
      if (!this.memoryStore) return
      const keys = Array.from(this.memoryStore.keys())
      for (const key of keys) {
        const s = this.memoryStore.get(key)
        if (s && s.userId === userId) this.memoryStore.delete(key)
      }
      return
    }
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
          if (session.userId === userId) sessionsToDelete.push(key)
        } catch {
          sessionsToDelete.push(key)
        }
      }
    }
    if (sessionsToDelete.length > 0) await this.client.del(sessionsToDelete)
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
    
    const keys = this.client ? await this.client.keys(pattern) : []
    const now = Date.now()
    const expiredKeys: string[] = []
    
    for (const key of keys) {
      const data = this.client ? await this.client.get(key) : null
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
    
    if (expiredKeys.length > 0 && this.client) await this.client.del(expiredKeys)
    
    return expiredKeys.length
  }

  async getSessionCount(): Promise<number> {
    await this.connect()
    
    const config = getConfig()
    const prefix = config.redis.REDIS_KEY_PREFIX || 'linea:'
    const pattern = `${prefix}session:*`
    
    const keys = this.client ? await this.client.keys(pattern) : []
    return keys.length
  }

  async isHealthy(): Promise<boolean> {
    if (!this.client) {
      return false
    }
    
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
