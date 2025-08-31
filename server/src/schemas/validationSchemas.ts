import { z } from 'zod';

/**
 * Schema para validação de URLs
 * Inclui validação de formato, protocolo e sanitização
 */
export const urlSchema = z
  .string()
  .min(1, 'URL não pode estar vazia')
  .max(2048, 'URL muito longa (máximo 2048 caracteres)')
  .url('Formato de URL inválido')
  .refine(
    (url) => {
      try {
        const urlObj = new URL(url);
        return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
      } catch {
        return false;
      }
    },
    {
      message: 'URL deve usar protocolo HTTP ou HTTPS'
    }
  )
  .refine(
    (url) => {
      // Previne URLs com caracteres suspeitos
      const suspiciousPatterns = [
        /javascript:/i,
        /data:/i,
        /vbscript:/i,
        /file:/i,
        /ftp:/i
      ];
      
      return !suspiciousPatterns.some(pattern => pattern.test(url));
    },
    {
      message: 'URL contém protocolo não permitido'
    }
  )
  .transform((url) => {
    // Sanitiza a URL
    let sanitized = url.trim();
    
    // Remove espaços em branco
    sanitized = sanitized.replace(/\s+/g, '');
    
    // Adiciona protocolo se não existir
    if (!sanitized.startsWith('http://') && !sanitized.startsWith('https://')) {
      sanitized = 'https://' + sanitized;
    }
    
    return sanitized;
  });

/**
 * Schema para validação de URLs encurtadas
 */
export const shortUrlSchema = z
  .string()
  .min(3, 'URL encurtada deve ter pelo menos 3 caracteres')
  .max(20, 'URL encurtada deve ter no máximo 20 caracteres')
  .regex(
    /^[a-zA-Z0-9-]+$/,
    'URL encurtada deve conter apenas letras, números e hífens'
  )
  .refine(
    (shortUrl) => {
      // Lista de palavras reservadas que não devem ser usadas
      const reservedWords = [
        'admin', 'api', 'auth', 'login', 'logout', 'register',
        'dashboard', 'settings', 'profile', 'help', 'about',
        'contact', 'terms', 'privacy', 'health', 'status'
      ];
      
      return !reservedWords.includes(shortUrl.toLowerCase());
    },
    {
      message: 'URL encurtada contém palavra reservada'
    }
  );

/**
 * Schema para criação de links
 */
export const createLinkSchema = z.object({
  originalUrl: urlSchema,
  shortUrl: shortUrlSchema.optional()
});

/**
 * Schema para listagem de links com paginação
 */
export const getLinksSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10)
});

/**
 * Schema para operações com ID de link
 */
export const linkIdSchema = z.object({
  id: z.string().uuid('ID deve ser um UUID válido')
});

/**
 * Schema para operações com URL encurtada
 */
export const shortUrlParamSchema = z.object({
  shortUrl: shortUrlSchema
});

/**
 * Schema para validação de relatórios CSV
 */
export const csvReportSchema = z.object({
  fileName: z.string().min(1).max(255),
  publicUrl: urlSchema,
  fileSize: z.number().int().positive()
});

/**
 * Tipos TypeScript derivados dos schemas
 */
export type CreateLinkInput = z.infer<typeof createLinkSchema>;
export type GetLinksInput = z.infer<typeof getLinksSchema>;
export type LinkIdInput = z.infer<typeof linkIdSchema>;
export type ShortUrlInput = z.infer<typeof shortUrlParamSchema>;
export type CsvReportInput = z.infer<typeof csvReportSchema>;

/**
 * Função para validar e sanitizar URL
 * @param url - URL a ser validada
 * @returns URL sanitizada ou erro
 */
export function validateAndSanitizeUrl(url: string): { success: true; url: string } | { success: false; error: string } {
  try {
    const result = urlSchema.parse(url);
    return { success: true, url: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0]?.message || 'Erro de validação' };
    }
    return { success: false, error: 'Erro de validação desconhecido' };
  }
}

/**
 * Função para validar URL encurtada
 * @param shortUrl - URL encurtada a ser validada
 * @returns true se válida, false caso contrário
 */
export function validateShortUrl(shortUrl: string): { success: true } | { success: false; error: string } {
  try {
    shortUrlSchema.parse(shortUrl);
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0]?.message || 'Erro de validação' };
    }
    return { success: false, error: 'Erro de validação desconhecido' };
  }
}
