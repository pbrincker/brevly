import { FastifyInstance } from 'fastify';
import { LinkController } from '../controllers/linkController';

export async function linkRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.post('/links', LinkController.createLink);
  fastify.get('/links', LinkController.getLinks);
  fastify.get('/links/:id', LinkController.getLink);
  fastify.get('/links/short/:shortUrl', LinkController.getLinkByShortUrl);
  fastify.delete('/links/:id', LinkController.deleteLink);
}
