import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import Fastify from 'fastify';

describe('API', () => {
  let app: Fastify.FastifyInstance;

  beforeAll(async () => {
    app = Fastify({ logger: false });

    // Register basic routes for testing
    app.get('/health', async () => {
      return { status: 'healthy' };
    });

    app.get('/', async () => {
      return { message: 'API is running' };
    });

    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should respond to health check', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/health',
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ status: 'healthy' });
  });

  it('should respond to root endpoint', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/',
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toHaveProperty('message');
  });
});
