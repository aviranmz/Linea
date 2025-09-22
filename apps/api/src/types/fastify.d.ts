declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      id: string
      email: string
      name: string | null
      role: string
    }
  }
}
