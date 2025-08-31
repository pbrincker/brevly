# Brev.ly - Encurtador de URLs

🔗 Um encurtador de URLs moderno e escalável, construído com Fastify, TypeScript, PostgreSQL e React.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Fastify](https://img.shields.io/badge/fastify-202020?style=for-the-badge&logo=fastify&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

## 🚀 Funcionalidades

- **Encurtamento de URLs**: Criação de links curtos e personalizados
- **Contador de Acessos**: Rastreamento automático de cliques
- **Relatórios CSV**: Exportação de dados com upload para Cloudflare R2
- **API RESTful**: Endpoints completos para gerenciamento de links
- **Interface Moderna**: Frontend React com Tailwind CSS
- **Validação Robusta**: Sanitização e validação de URLs
- **Segurança**: Middlewares de proteção contra ataques comuns

## 🏗️ Arquitetura

### Backend (Fastify + TypeScript)

- **Framework**: Fastify para alta performance
- **Banco de Dados**: PostgreSQL com Drizzle ORM
- **Validação**: Zod para schemas e validação
- **Storage**: Cloudflare R2 para arquivos CSV
- **Segurança**: Middlewares de proteção e sanitização

### Frontend (React + TypeScript)

- **Framework**: React 18 com TypeScript
- **Estilização**: Tailwind CSS
- **Gerenciamento de Estado**: TanStack Query
- **Build**: Vite para desenvolvimento rápido

## 📋 Pré-requisitos

- Node.js 18+ ou 20+
- PostgreSQL 14+
- Docker e Docker Compose (opcional)
- Conta no Cloudflare R2 (para relatórios CSV)

## 🛠️ Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/username/brevly.git
cd brevly
```

### 2. Configure as variáveis de ambiente

Crie os arquivos de ambiente baseados nos exemplos:

#### Backend (server/.env)

```bash
cp server/.env.example server/.env
```

Edite `server/.env` com suas configurações:

```bash
# Configurações do Servidor
PORT=3333
NODE_ENV=development

# Configurações do Banco de Dados
DATABASE_URL=postgresql://username:password@localhost:5432/brevly_db

# Configurações do Cloudflare R2
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_ACCESS_KEY_ID=your_access_key_id
CLOUDFLARE_SECRET_ACCESS_KEY=your_secret_access_key
CLOUDFLARE_BUCKET=your_bucket_name
CLOUDFLARE_PUBLIC_URL=https://your-public-domain.com

# Configurações de CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:5173

# Configurações de Segurança
SESSION_MAX_AGE=86400
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW_MS=60000
```

#### Frontend (web/.env)

```bash
cp web/.env.example web/.env
```

Edite `web/.env`:

```bash
VITE_API_URL=http://localhost:3333/api
VITE_FRONTEND_URL=http://localhost:5173
```

### 3. Configure o Cloudflare R2

1. Crie uma conta no [Cloudflare](https://cloudflare.com)
2. Acesse o R2 Object Storage
3. Crie um bucket para os relatórios
4. Configure as credenciais de acesso
5. Configure um domínio público para o bucket (opcional)

### 4. Instale as dependências

#### Backend

```bash
cd server
npm install
```

#### Frontend

```bash
cd web
npm install
```

### 5. Configure o banco de dados

```bash
cd server
npm run db:generate
npm run db:migrate
```

## 🚀 Executando o Projeto

### Desenvolvimento

#### Backend

```bash
cd server
npm run dev
```

#### Frontend

```bash
cd web
npm run dev
```

### Produção com Docker

```bash
# Executar com docker-compose
docker-compose up -d

# Para rebuild das imagens
docker-compose up -d --build

# Para parar os containers
docker-compose down
```

## 📚 API Endpoints

### Links

- `POST /api/links` - Criar novo link
- `GET /api/links` - Listar links (com paginação)
- `GET /api/links/:id` - Obter link específico
- `DELETE /api/links/:id` - Deletar link
- `GET /:shortUrl` - Redirecionar para URL original

### Relatórios

- `POST /api/reports/csv` - Gerar relatório CSV
- `GET /api/reports/csv` - Listar relatórios gerados

### Health Check

- `GET /health` - Status da aplicação

## 🔧 Scripts Disponíveis

### Backend

- `npm run dev` - Executa em modo desenvolvimento
- `npm run build` - Compila o TypeScript
- `npm run start` - Executa em modo produção
- `npm run db:generate` - Gera migrações do banco
- `npm run db:migrate` - Executa migrações
- `npm run db:studio` - Abre o Drizzle Studio

### Frontend

- `npm run dev` - Executa em modo desenvolvimento
- `npm run build` - Compila para produção
- `npm run preview` - Preview da build

## 🏗️ Estrutura do Projeto

```
brevly/
├── server/                 # Backend Fastify
│   ├── src/
│   │   ├── config/        # Configurações
│   │   ├── controllers/   # Controllers da API
│   │   ├── database/      # Configuração do banco
│   │   ├── middlewares/   # Middlewares de segurança
│   │   ├── routes/        # Definição de rotas
│   │   ├── schemas/       # Schemas de validação
│   │   ├── services/      # Serviços (R2, etc.)
│   │   ├── types/         # Tipos TypeScript
│   │   ├── utils/         # Utilitários
│   │   └── server.ts      # Entrada da aplicação
│   ├── Dockerfile
│   └── package.json
├── web/                   # Frontend React
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── services/      # Serviços de API
│   │   ├── types/         # Tipos TypeScript
│   │   ├── utils/         # Utilitários
│   │   └── main.tsx       # Entrada da aplicação
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── README.md
```

## 🔒 Segurança

- **Validação de URLs**: Sanitização e validação rigorosa
- **Headers de Segurança**: CORS, CSP, XSS Protection
- **Rate Limiting**: Proteção contra spam
- **Sanitização**: Remoção de caracteres perigosos
- **Logs de Segurança**: Monitoramento de tentativas suspeitas

## 📊 Monitoramento

- **Health Checks**: Endpoint `/health` para monitoramento
- **Logs Estruturados**: Logs detalhados com Pino
- **Métricas**: Contadores de acessos e estatísticas

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🚀 Deploy

### Variáveis de Ambiente para Produção

Certifique-se de configurar as seguintes variáveis no seu ambiente de produção:

- `NODE_ENV=production`
- `DATABASE_URL` - URL completa do PostgreSQL
- `CLOUDFLARE_*` - Credenciais do Cloudflare R2
- `CORS_ORIGIN` - Domínios permitidos para CORS

### Health Check

O backend expõe um endpoint de health check em `/health` que pode ser usado para monitoramento.

```bash
curl http://localhost:3333/health
```

## 🆘 Suporte

Para suporte, abra uma issue no GitHub.

---

**Brev.ly** - Encurtando URLs, expandindo possibilidades! 🚀
