import { FastifyRequest } from 'fastify';

export interface CreateLinkRequest {
  originalUrl: string;
  shortUrl?: string;
}

export interface DeleteLinkRequest {
  Params: {
    id: string;
  };
}

export interface GetLinkRequest {
  Params: {
    shortUrl: string;
  };
}

export interface GetLinksRequest {
  Querystring: {
    page?: number;
    limit?: number;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface LinkResponse {
  id: string;
  originalUrl: string;
  shortUrl: string;
  accessCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface LinksListResponse {
  links: LinkResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CsvReportResponse {
  id: string;
  fileName: string;
  publicUrl: string;
  fileSize: number;
  createdAt: string;
}

export interface AuthenticatedRequest extends FastifyRequest {
  user?: {
    id: string;
    email: string;
  };
}

export const createLinkSchema = {
  type: 'object',
  required: ['originalUrl'],
  properties: {
    originalUrl: {
      type: 'string',
      format: 'uri',
      minLength: 1,
      maxLength: 2048
    },
    shortUrl: {
      type: 'string',
      minLength: 3,
      maxLength: 20,
      pattern: '^[a-zA-Z0-9-]+$'
    }
  }
};

export const getLinksSchema = {
  type: 'object',
  properties: {
    page: {
      type: 'number',
      minimum: 1,
      default: 1
    },
    limit: {
      type: 'number',
      minimum: 1,
      maximum: 100,
      default: 10
    }
  }
};

export const deleteLinkSchema = {
  type: 'object',
  required: ['id'],
  properties: {
    id: {
      type: 'string',
      format: 'uuid'
    }
  }
};
