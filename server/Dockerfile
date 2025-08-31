# Dockerfile para o Backend do Brev.ly
# Usando Node.js 18 Alpine para menor tamanho de imagem

# Estágio de build
FROM node:18-alpine AS builder

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de configuração
COPY package*.json ./
COPY tsconfig.json ./
COPY drizzle.config.ts ./

# Instala TODAS as dependências (incluindo devDependencies para o build)
RUN npm ci

# Copia o código fonte
COPY src/ ./src/

# Compila o TypeScript
RUN npm run build

# Estágio de produção
FROM node:18-alpine AS production

# Instala dumb-init para gerenciar processos
RUN apk add --no-cache dumb-init

# Cria usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de configuração
COPY package*.json ./

# Instala apenas as dependências de produção
RUN npm ci --only=production && npm cache clean --force

# Copia os arquivos compilados do estágio de build
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist

# Copia arquivos de configuração necessários
COPY --chown=nodejs:nodejs drizzle.config.ts ./

# Muda para o usuário não-root
USER nodejs

# Expõe a porta da aplicação
EXPOSE 3333

# Define variáveis de ambiente
ENV NODE_ENV=production
ENV PORT=3333

# Usa dumb-init para gerenciar o processo Node.js
ENTRYPOINT ["dumb-init", "--"]

# Comando para iniciar a aplicação
CMD ["node", "dist/server.js"]

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3333/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })" || exit 1
