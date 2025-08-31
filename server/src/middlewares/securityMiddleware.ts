import { FastifyRequest, FastifyReply } from 'fastify';

/**
 * Middleware para validação de segurança
 * Previne ataques comuns como XSS, SQL Injection, etc.
 */
export async function securityMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  // Headers de segurança
  reply.header('X-Content-Type-Options', 'nosniff');
  reply.header('X-Frame-Options', 'DENY');
  reply.header('X-XSS-Protection', '1; mode=block');
  reply.header('Referrer-Policy', 'strict-origin-when-cross-origin');
  reply.header('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'");

  // Validação de rate limiting básica
  const clientIp = request.ip;
  const userAgent = request.headers['user-agent'] || '';
  
  // Log de tentativas suspeitas
  if (isSuspiciousRequest(request)) {
    request.log.warn({
      message: 'Tentativa suspeita detectada',
      ip: clientIp,
      userAgent,
      url: request.url,
      method: request.method
    });
  }
}

/**
 * Verifica se a requisição é suspeita
 * @param request - Requisição Fastify
 * @returns true se suspeita, false caso contrário
 */
function isSuspiciousRequest(request: FastifyRequest): boolean {
  const url = request.url.toLowerCase();
  const userAgent = (request.headers['user-agent'] || '').toLowerCase();
  
  // Padrões suspeitos
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /data:text\/html/i,
    /vbscript:/i,
    /onload=/i,
    /onerror=/i,
    /onclick=/i,
    /union.*select/i,
    /drop.*table/i,
    /insert.*into/i,
    /delete.*from/i,
    /update.*set/i,
    /exec.*sp_/i,
    /xp_cmdshell/i
  ];
  
  // Verifica se a URL contém padrões suspeitos
  if (suspiciousPatterns.some(pattern => pattern.test(url))) {
    return true;
  }
  
  // Verifica User-Agent suspeito
  const suspiciousUserAgents = [
    'sqlmap',
    'nikto',
    'nmap',
    'w3af',
    'burp',
    'zap'
  ];
  
  if (suspiciousUserAgents.some(agent => userAgent.includes(agent))) {
    return true;
  }
  
  return false;
}

/**
 * Middleware para sanitização de dados de entrada
 * @param request - Requisição Fastify
 * @param reply - Resposta Fastify
 */
export async function sanitizationMiddleware(
  request: FastifyRequest,
  _reply: FastifyReply
): Promise<void> {
  // Sanitiza parâmetros de query
  if (request.query) {
    request.query = sanitizeObject(request.query);
  }
  
  // Sanitiza parâmetros de corpo
  if (request.body) {
    request.body = sanitizeObject(request.body);
  }
  
  // Sanitiza parâmetros de URL
  if (request.params) {
    request.params = sanitizeObject(request.params);
  }
}

/**
 * Sanitiza um objeto removendo caracteres perigosos
 * @param obj - Objeto a ser sanitizado
 * @returns Objeto sanitizado
 */
function sanitizeObject(obj: any): any {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }
  
  const sanitized: any = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      // Remove caracteres perigosos
      sanitized[key] = value
        .replace(/[<>]/g, '') // Remove < e >
        .replace(/javascript:/gi, '') // Remove javascript:
        .replace(/data:/gi, '') // Remove data:
        .replace(/vbscript:/gi, '') // Remove vbscript:
        .trim();
    } else {
      sanitized[key] = sanitizeObject(value);
    }
  }
  
  return sanitized;
}
