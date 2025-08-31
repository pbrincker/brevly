/**
 * Schemas JSON nativos para o Fastify
 * Estes schemas são compatíveis com o sistema de validação nativo do Fastify
 */

/**
 * Schema para validação de URLs
 */
export const urlSchema = {
  type: 'string',
  minLength: 1,
  maxLength: 2048,
  format: 'uri',
  pattern: '^https?://.+',
  errorMessage: {
    type: 'URL deve ser uma string',
    minLength: 'URL não pode estar vazia',
    maxLength: 'URL muito longa (máximo 2048 caracteres)',
    format: 'Formato de URL inválido',
    pattern: 'URL deve usar protocolo HTTP ou HTTPS'
  }
};

/**
 * Schema para validação de URLs encurtadas
 */
export const shortUrlSchema = {
  type: 'string',
  minLength: 3,
  maxLength: 20,
  pattern: '^[a-zA-Z0-9-]+$',
  errorMessage: {
    type: 'URL encurtada deve ser uma string',
    minLength: 'URL encurtada deve ter pelo menos 3 caracteres',
    maxLength: 'URL encurtada deve ter no máximo 20 caracteres',
    pattern: 'URL encurtada deve conter apenas letras, números e hífens'
  }
};

/**
 * Schema para criação de links
 */
export const createLinkSchema = {
  type: 'object',
  properties: {
    originalUrl: urlSchema,
    shortUrl: shortUrlSchema
  },
  required: ['originalUrl'],
  additionalProperties: false,
  errorMessage: {
    required: {
      originalUrl: 'URL original é obrigatória'
    },
    additionalProperties: 'Propriedades adicionais não são permitidas'
  }
};

/**
 * Schema para listagem de links com paginação
 */
export const getLinksSchema = {
  type: 'object',
  properties: {
    page: {
      type: 'string',
      pattern: '^[1-9]\\d*$',
      default: '1'
    },
    limit: {
      type: 'string',
      pattern: '^[1-9]\\d*$',
      maximum: 100,
      default: '10'
    }
  },
  additionalProperties: false
};

/**
 * Schema para operações com ID de link
 */
export const linkIdSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
      errorMessage: {
        format: 'ID deve ser um UUID válido'
      }
    }
  },
  required: ['id'],
  additionalProperties: false
};

/**
 * Schema para operações com URL encurtada
 */
export const shortUrlParamSchema = {
  type: 'object',
  properties: {
    shortUrl: shortUrlSchema
  },
  required: ['shortUrl'],
  additionalProperties: false
};

/**
 * Schema para validação de relatórios CSV
 */
export const csvReportSchema = {
  type: 'object',
  properties: {
    fileName: {
      type: 'string',
      minLength: 1,
      maxLength: 255
    },
    publicUrl: urlSchema,
    fileSize: {
      type: 'number',
      minimum: 1
    }
  },
  required: ['fileName', 'publicUrl', 'fileSize'],
  additionalProperties: false
};
