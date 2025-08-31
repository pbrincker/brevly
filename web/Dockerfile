# Dockerfile para o Frontend do Brev.ly
# Usando Node.js 20 Alpine para build e Nginx para servir os arquivos estáticos

# Estágio de build
FROM node:20-alpine AS builder

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de configuração
COPY package*.json ./
COPY tsconfig*.json ./
COPY vite.config.ts ./
COPY tailwind.config.js ./
COPY postcss.config.js ./

# Instala as dependências
RUN npm ci

# Copia o código fonte
COPY src/ ./src/
COPY public/ ./public/
COPY index.html ./

# Compila a aplicação
RUN npm run build

# Estágio de produção com Nginx
FROM nginx:alpine AS production

# Copia a configuração customizada do Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Copia os arquivos compilados do estágio de build
COPY --from=builder /app/dist /usr/share/nginx/html

# Define permissões corretas (nginx já existe na imagem base)
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d

# Muda para o usuário nginx
USER nginx

# Expõe a porta 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

# Comando para iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]
