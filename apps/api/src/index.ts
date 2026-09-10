import Fastify from 'fastify';
import cors from '@fastify/cors';
import { assessmentRoutes } from './routes/assessments';

const fastify = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
  },
});

async function start() {
  // Enable CORS for Base44 / React frontend communication
  await fastify.register(cors, {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  });

  // Register API Routes with prefix
  await fastify.register(assessmentRoutes, { prefix: '/api/v1' });

  // Health check endpoint
  fastify.get('/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }));

  const port = parseInt(process.env.PORT || '3000', 10);
  const host = process.env.HOST || '0.0.0.0';

  try {
    await fastify.listen({ port, host });
    console.log(`[+] API Gateway running on http://${host}:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();
