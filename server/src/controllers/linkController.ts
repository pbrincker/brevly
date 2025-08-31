import { FastifyRequest, FastifyReply } from 'fastify';
import { eq, desc, count, sql } from 'drizzle-orm';
import { db } from '../database/connection';
import { links } from '../database/schema';
import { 
  generateShortUrl
} from '../utils/urlUtils';
import { 
  validateAndSanitizeUrl,
  validateShortUrl,
  CreateLinkInput,
  GetLinksInput,
  LinkIdInput,
  ShortUrlInput
} from '../schemas/validationSchemas';
import { 
  ApiResponse,
  LinkResponse,
  LinksListResponse
} from '../types';

export class LinkController {
  static async createLink(
    request: FastifyRequest<{ Body: CreateLinkInput }>,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    try {
      const { originalUrl, shortUrl } = request.body;

      const urlValidation = validateAndSanitizeUrl(originalUrl);
      if (!urlValidation.success) {
        return reply.status(400).send({
          success: false,
          error: urlValidation.error
        } as ApiResponse);
      }

      const sanitizedUrl = urlValidation.url;
      let finalShortUrl = shortUrl;

      if (!finalShortUrl) {
        finalShortUrl = generateShortUrl();
      } else {
        const shortUrlValidation = validateShortUrl(finalShortUrl);
        if (!shortUrlValidation.success) {
          return reply.status(400).send({
            success: false,
            error: shortUrlValidation.error
          } as ApiResponse);
        }
      }

      const result = await db.transaction(async (tx) => {
        const existingLinkByOriginal = await tx
          .select()
          .from(links)
          .where(eq(links.originalUrl, sanitizedUrl))
          .limit(1);

        if (existingLinkByOriginal.length > 0) {
          return { type: 'existing', link: existingLinkByOriginal[0] };
        }

        if (finalShortUrl) {
          const existingLinkByShort = await tx
            .select()
            .from(links)
            .where(eq(links.shortUrl, finalShortUrl))
            .limit(1);

          if (existingLinkByShort.length > 0) {
            throw new Error('URL encurtada já existe');
          }
        }

        const [newLink] = await tx
          .insert(links)
          .values({
            originalUrl: sanitizedUrl,
            shortUrl: finalShortUrl,
            accessCount: 0
          })
          .returning();

        return { type: 'new', link: newLink };
      });

      if (result.type === 'existing') {
        const existingLink = result.link;
        if (!existingLink) {
          throw new Error('Link existente não encontrado');
        }
        
        const response: LinkResponse = {
          id: existingLink.id,
          originalUrl: existingLink.originalUrl,
          shortUrl: existingLink.shortUrl,
          accessCount: existingLink.accessCount,
          createdAt: existingLink.createdAt.toISOString(),
          updatedAt: existingLink.updatedAt.toISOString()
        };

        return reply.status(200).send({
          success: true,
          data: response,
          message: 'Link já existe'
        } as ApiResponse<LinkResponse>);
      } else {
        const newLink = result.link;
        if (!newLink) {
          throw new Error('Novo link não foi criado');
        }

        const response: LinkResponse = {
          id: newLink.id,
          originalUrl: newLink.originalUrl,
          shortUrl: newLink.shortUrl,
          accessCount: newLink.accessCount,
          createdAt: newLink.createdAt.toISOString(),
          updatedAt: newLink.updatedAt.toISOString()
        };

        return reply.status(201).send({
          success: true,
          data: response,
          message: 'Link criado com sucesso'
        } as ApiResponse<LinkResponse>);
      }

    } catch (error) {
      console.error('Erro ao criar link:', error);
      
      if (error instanceof Error) {
        if (error.message === 'URL encurtada já existe') {
          return reply.status(409).send({
            success: false,
            error: error.message
          } as ApiResponse);
        }
      }
      
      return reply.status(500).send({
        success: false,
        error: 'Erro interno do servidor'
      } as ApiResponse);
    }
  }

  static async getLinks(
    request: FastifyRequest<{ Querystring: GetLinksInput }>,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    try {
      const { page = 1, limit = 10 } = request.query;
      const offset = (page - 1) * limit;

      const linksList = await db
        .select()
        .from(links)
        .orderBy(desc(links.createdAt))
        .limit(limit)
        .offset(offset);

      const totalResult = await db
        .select({ value: count() })
        .from(links);
      
      const total = totalResult[0]?.value || 0;

      const response: LinksListResponse = {
        links: linksList.map(link => ({
          id: link.id,
          originalUrl: link.originalUrl,
          shortUrl: link.shortUrl,
          accessCount: link.accessCount,
          createdAt: link.createdAt.toISOString(),
          updatedAt: link.updatedAt.toISOString()
        })),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };

      return reply.send({
        success: true,
        data: response
      } as ApiResponse<LinksListResponse>);

    } catch (error) {
      console.error('Erro ao listar links:', error);
      return reply.status(500).send({
        success: false,
        error: 'Erro interno do servidor'
      } as ApiResponse);
    }
  }

  static async getLink(
    request: FastifyRequest<{ Params: LinkIdInput }>,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    try {
      const { id } = request.params;

      const [link] = await db
        .select()
        .from(links)
        .where(eq(links.id, id))
        .limit(1);

      if (!link) {
        return reply.status(404).send({
          success: false,
          error: 'Link não encontrado'
        } as ApiResponse);
      }

      const response: LinkResponse = {
        id: link.id,
        originalUrl: link.originalUrl,
        shortUrl: link.shortUrl,
        accessCount: link.accessCount,
        createdAt: link.createdAt.toISOString(),
        updatedAt: link.updatedAt.toISOString()
      };

      return reply.send({
        success: true,
        data: response
      } as ApiResponse<LinkResponse>);

    } catch (error) {
      console.error('Erro ao buscar link:', error);
      return reply.status(500).send({
        success: false,
        error: 'Erro interno do servidor'
      } as ApiResponse);
    }
  }

  static async getLinkByShortUrl(
    request: FastifyRequest<{ Params: ShortUrlInput }>,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    try {
      const { shortUrl } = request.params;

      const [link] = await db
        .select()
        .from(links)
        .where(eq(links.shortUrl, shortUrl))
        .limit(1);

      if (!link) {
        return reply.status(404).send({
          success: false,
          error: 'Link não encontrado'
        } as ApiResponse);
      }

      const response: LinkResponse = {
        id: link.id,
        originalUrl: link.originalUrl,
        shortUrl: link.shortUrl,
        accessCount: link.accessCount,
        createdAt: link.createdAt.toISOString(),
        updatedAt: link.updatedAt.toISOString()
      };

      return reply.send({
        success: true,
        data: response
      } as ApiResponse<LinkResponse>);

    } catch (error) {
      console.error('Erro ao buscar link por shortUrl:', error);
      return reply.status(500).send({
        success: false,
        error: 'Erro interno do servidor'
      } as ApiResponse);
    }
  }

  static async deleteLink(
    request: FastifyRequest<{ Params: LinkIdInput }>,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    try {
      const { id } = request.params;

      const [deletedLink] = await db
        .delete(links)
        .where(eq(links.id, id))
        .returning();

      if (!deletedLink) {
        return reply.status(404).send({
          success: false,
          error: 'Link não encontrado'
        } as ApiResponse);
      }

      return reply.send({
        success: true,
        message: 'Link deletado com sucesso'
      } as ApiResponse);

    } catch (error) {
      console.error('Erro ao deletar link:', error);
      return reply.status(500).send({
        success: false,
        error: 'Erro interno do servidor'
      } as ApiResponse);
    }
  }

  static async redirectToOriginal(
    request: FastifyRequest<{ Params: ShortUrlInput }>,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    try {
      const { shortUrl } = request.params;

      const [link] = await db
        .select()
        .from(links)
        .where(eq(links.shortUrl, shortUrl))
        .limit(1);

      if (!link) {
        return reply.status(404).send({
          success: false,
          error: 'Link não encontrado'
        } as ApiResponse);
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
      console.error('Erro ao redirecionar:', error);
      return reply.status(500).send({
        success: false,
        error: 'Erro interno do servidor'
      } as ApiResponse);
    }
  }
}
