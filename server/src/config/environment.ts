/**
 * Configuração de variáveis de ambiente
 * Centraliza o gerenciamento de todas as variáveis de ambiente da aplicação
 */

export interface EnvironmentConfig {
  // Configurações do Servidor
  port: number;
  nodeEnv: string;
  
  // Configurações do Banco de Dados
  databaseUrl: string;
  
  // Configurações do Cloudflare R2
  cloudflareAccountId: string;
  cloudflareAccessKeyId: string;
  cloudflareSecretAccessKey: string;
  cloudflareBucket: string;
  cloudflarePublicUrl: string;
  
  // Configurações de CORS
  corsOrigins: string[];
  
  // Configurações de Segurança
  sessionMaxAge: number;
  rateLimitMax: number;
  rateLimitWindowMs: number;
}

/**
 * Valida e retorna a configuração de ambiente
 */
export function getEnvironmentConfig(): EnvironmentConfig {
  // Para desenvolvimento, usar valores padrão se as variáveis não estiverem definidas
  const databaseUrl = process.env['DATABASE_URL'] || 'postgresql://brevly_user:brevly_password@localhost:5432/brevly';
  const cloudflareAccountId = process.env['CLOUDFLARE_ACCOUNT_ID'] || 'temp_account_id';
  const cloudflareAccessKeyId = process.env['CLOUDFLARE_ACCESS_KEY_ID'] || 'temp_access_key';
  const cloudflareSecretAccessKey = process.env['CLOUDFLARE_SECRET_ACCESS_KEY'] || 'temp_secret_key';
  const cloudflareBucket = process.env['CLOUDFLARE_BUCKET'] || 'temp_bucket';
  const cloudflarePublicUrl = process.env['CLOUDFLARE_PUBLIC_URL'] || 'https://temp-domain.com';

  // Configuração de CORS
  const corsOrigins = process.env['CORS_ORIGIN'] 
    ? process.env['CORS_ORIGIN'].split(',').map(origin => origin.trim())
    : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176', 'http://localhost:5177'];

  return {
    // Configurações do Servidor
    port: parseInt(process.env['PORT'] || '3333', 10),
    nodeEnv: process.env['NODE_ENV'] || 'development',
    
    // Configurações do Banco de Dados
    databaseUrl,
    
    // Configurações do Cloudflare R2
    cloudflareAccountId,
    cloudflareAccessKeyId,
    cloudflareSecretAccessKey,
    cloudflareBucket,
    cloudflarePublicUrl,
    
    // Configurações de CORS
    corsOrigins,
    
    // Configurações de Segurança
    sessionMaxAge: parseInt(process.env['SESSION_MAX_AGE'] || '86400', 10),
    rateLimitMax: parseInt(process.env['RATE_LIMIT_MAX'] || '100', 10),
    rateLimitWindowMs: parseInt(process.env['RATE_LIMIT_WINDOW_MS'] || '60000', 10)
  };
}

/**
 * Verifica se a aplicação está em modo de produção
 */
export function isProduction(): boolean {
  return process.env['NODE_ENV'] === 'production';
}

/**
 * Verifica se a aplicação está em modo de desenvolvimento
 */
export function isDevelopment(): boolean {
  return process.env['NODE_ENV'] === 'development';
}

/**
 * Retorna a configuração de ambiente como objeto
 */
export const env = getEnvironmentConfig();
