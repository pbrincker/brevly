import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { linkRoutes } from './routes/linkRoutes';
import { reportRoutes } from './routes/reportRoutes';
import { checkConnection } from './database/connection';
import { securityMiddleware, sanitizationMiddleware } from './middlewares/securityMiddleware';
import { env, isProduction } from './config/environment';

const fastify = Fastify({
  logger: isProduction() ? {
    level: 'info'
  } : {
    level: 'debug',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname'
      }
    }
  },
  trustProxy: true
});

async function registerPlugins(): Promise<void> {
  await fastify.register(cors, {
    origin: env.corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin'
    ],
    exposedHeaders: ['Content-Length', 'X-Total-Count'],
    maxAge: env.sessionMaxAge
  });
}

async function registerRoutes(): Promise<void> {
  fastify.get('/health', async () => {
    const dbStatus = await checkConnection();
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: dbStatus ? 'connected' : 'disconnected',
      uptime: process.uptime()
    };
  });

  const { LinkController } = await import('./controllers/linkController');
  fastify.get('/:shortUrl', LinkController.redirectToOriginal);
  await fastify.register(linkRoutes, { prefix: '/api' });
  await fastify.register(reportRoutes);
}

function setupHooks(): void {
  fastify.addHook('onRequest', async (request, reply) => {
    await securityMiddleware(request, reply);
    await sanitizationMiddleware(request, reply);
    
    request.log.info({
      method: request.method,
      url: request.url,
      ip: request.ip,
      userAgent: request.headers['user-agent']
    });
  });

  fastify.setErrorHandler((error, request, reply) => {
    request.log.error(error);
    
    if (error.validation) {
      return reply.status(400).send({
        success: false,
        error: 'Dados inválidos',
        details: error.validation
      });
    }

    return reply.status(500).send({
      success: false,
      error: 'Erro interno do servidor'
    });
  });

  fastify.setNotFoundHandler((_request, reply) => {
    return reply.status(404).send({
      success: false,
      error: 'Rota não encontrada'
    });
  });
}

async function start(): Promise<void> {
  try {
    await registerPlugins();
    setupHooks();
    await registerRoutes();

    const port = env.port;
    const host = isProduction() ? '0.0.0.0' : 'localhost';

    await fastify.listen({ port, host });

    console.log(`Servidor rodando em http://${host}:${port}`);
    console.log(`Health check: http://${host}:${port}/health`);

  } catch (error) {
    console.error('Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

async function gracefulShutdown(): Promise<void> {
  console.log('\nRecebido sinal de shutdown, fechando servidor...');
  
  try {
    await fastify.close();
    console.log('Servidor fechado com sucesso');
    process.exit(0);
  } catch (error) {
    console.error('Erro ao fechar servidor:', error);
    process.exit(1);
  }
}

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

start();
