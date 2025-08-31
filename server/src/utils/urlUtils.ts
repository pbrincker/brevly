import { randomBytes } from 'crypto';

/**
 * Valida se uma URL é válida
 * @param url - URL a ser validada
 * @returns true se a URL for válida, false caso contrário
 */
export function isValidUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Gera uma URL encurtada aleatória
 * @param length - Comprimento da URL encurtada (padrão: 6)
 * @returns URL encurtada gerada
 */
export function generateShortUrl(length: number = 6): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
}

/**
 * Sanitiza uma URL removendo caracteres perigosos
 * @param url - URL a ser sanitizada
 * @returns URL sanitizada
 */
export function sanitizeUrl(url: string): string {
  // Remove espaços em branco
  let sanitized = url.trim();
  
  // Adiciona protocolo se não existir
  if (!sanitized.startsWith('http://') && !sanitized.startsWith('https://')) {
    sanitized = 'https://' + sanitized;
  }
  
  return sanitized;
}

/**
 * Valida se uma URL encurtada tem o formato correto
 * @param shortUrl - URL encurtada a ser validada
 * @returns true se o formato for válido, false caso contrário
 */
export function isValidShortUrl(shortUrl: string): boolean {
  // Deve ter entre 3 e 20 caracteres
  if (shortUrl.length < 3 || shortUrl.length > 20) {
    return false;
  }
  
  // Deve conter apenas letras, números e hífens
  const validChars = /^[a-zA-Z0-9-]+$/;
  return validChars.test(shortUrl);
}

/**
 * Gera um nome único para arquivos CSV
 * @returns Nome único do arquivo
 */
export function generateCsvFileName(): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const randomSuffix = randomBytes(4).toString('hex');
  return `brevly-report-${timestamp}-${randomSuffix}.csv`;
}
