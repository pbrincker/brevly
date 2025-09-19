import 'dotenv/config';
import Fastify, { FastifyBaseLogger, FastifyReply } from 'fastify';
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

const SHORT_URL_PATTERN = /^[A-Za-z0-9_-]+$/;

async function handleShortUrlRedirect(shortUrl: string, reply: FastifyReply, log: FastifyBaseLogger): Promise<FastifyReply> {
  try {
    const normalizedShortUrl = shortUrl.trim();
    log.info({ shortUrl: normalizedShortUrl }, 'Starting redirect process for short URL');

    const { db } = await import('./database/connection');
    const { links } = await import('./database/schema');
    const { eq, sql } = await import('drizzle-orm');

    log.info('Database imports successful, executing query');

    const [link] = await db
      .select()
      .from(links)
      .where(eq(links.shortUrl, normalizedShortUrl))
      .limit(1);

    log.info({
      shortUrl: normalizedShortUrl,
      foundLink: !!link,
      linkId: link?.id
    }, 'Database query completed');

    if (!link) {
      log.warn({ shortUrl: normalizedShortUrl }, 'Short URL not found in database');
      return reply.redirect(`${env.frontendUrl}/404`);
    }

    await db
      .update(links)
      .set({
        accessCount: sql`${links.accessCount} + 1`,
        updatedAt: new Date()
      })
      .where(eq(links.id, link.id));

    return reply.redirect(link.originalUrl);

  } catch (error) {
    log.error({ err: error, shortUrl }, 'Failed to redirect short URL');
    return reply.redirect(`${env.frontendUrl}/404`);
  }
}

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
  // Registra as rotas da API primeiro
  await fastify.register(linkRoutes, { prefix: '/api' });
  await fastify.register(reportRoutes);

  fastify.get('/health', async () => {
    const dbStatus = await checkConnection();
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: dbStatus ? 'connected' : 'disconnected',
      uptime: process.uptime()
    };
  });

  // Registra a rota de redirecionamento na raiz (sem prefixo /api) por ultimo
  fastify.get('/:shortUrl', {
    schema: {
      params: {
        type: 'object',
        properties: {
          shortUrl: { type: 'string', minLength: 1 }
        },
        required: ['shortUrl']
      }
    }
  }, async (request, reply) => {
    const { shortUrl } = request.params as { shortUrl: string };
    request.log.info({ shortUrl }, 'Handling redirect request in parametrized route');

    try {
      return await handleShortUrlRedirect(shortUrl, reply, request.log);
    } catch (error) {
      request.log.error({ err: error, shortUrl }, 'Error in redirect route handler');
      return reply.status(500).send({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  });

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
    }, 'Request received in onRequest hook');

    // Special logging for /teste1
    if (request.url === '/teste1') {
      request.log.info('Processing /teste1 request in onRequest hook');
    }
  });

  fastify.setErrorHandler((error, request, reply) => {
    request.log.error(error);

    if (error.validation) {
      return reply.status(400).send({
        success: false,
        error: 'Dados invalidos',
        details: error.validation
      });
    }

    return reply.status(500).send({
      success: false,
      error: 'Erro interno do servidor'
    });
  });

  fastify.setNotFoundHandler(async (request, reply) => {
    request.log.info({
      method: request.method,
      url: request.url,
      path: request.url.split('?')[0]
    }, 'Not found handler triggered');

    if (request.method === 'GET') {
      const [path] = request.url.split('?');
      const candidate = path.replace(/^\/+|\/+$/g, '');

      request.log.info({
        candidate,
        length: candidate.length,
        patternTest: SHORT_URL_PATTERN.test(candidate),
        isApiPath: candidate === 'api'
      }, 'Evaluating candidate for short URL redirect');

      if (
        candidate &&
        candidate.length <= 64 &&
        SHORT_URL_PATTERN.test(candidate) &&
        candidate !== 'api'
      ) {
        request.log.info({ candidate }, 'Candidate matches short URL pattern, redirecting');
        return handleShortUrlRedirect(candidate, reply, request.log);
      }
    }

    request.log.info('No valid short URL candidate found, returning 404');
    return reply.status(404).send({
      success: false,
      error: 'Rota nao encontrada'
    });
  });
}

async function start(): Promise<void> {
  try {
    await registerPlugins();
    await registerRoutes();
    setupHooks();

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
