# Brev.ly - Encurtador de URLs

Um sistema completo de encurtamento de URLs com contagem de acessos, relatórios CSV e armazenamento em nuvem.

## 🚀 Funcionalidades

- ✅ **Encurtamento de URLs**: Criação de links curtos personalizados
- ✅ **Contagem de Acessos**: Rastreamento automático de cliques em cada link
- ✅ **Relatórios CSV**: Exportação de dados para análise
- ✅ **Armazenamento R2**: Upload automático para Cloudflare R2
- ✅ **API RESTful**: Interface completa para integração
- ✅ **Interface Web**: Frontend React com design responsivo

## 🔧 Correções Recentes (v1.0.1)

### Problemas Resolvidos:

1. **✅ Erro FST_ERR_CTP_EMPTY_JSON_BODY**: Corrigida geração de relatórios CSV
2. **✅ Contagem de Acessos**: Implementada e testada funcionalidade de tracking
3. **✅ Dependências Drizzle**: Mantidas versões estáveis e compatíveis (drizzle-orm ^0.29.3, drizzle-kit ^0.20.6) com scripts corrigidos

### Como Aplicar as Correções:

```bash
cd server

# Windows
update-dependencies.bat

# Linux/Mac
chmod +x update-dependencies.sh
./update-dependencies.sh

# Gerar e aplicar migrações
npm run db:generate
npm run db:migrate

# Testar funcionalidades
node test-redirect.js
npm run dev
```

## 🏗️ Arquitetura

### Backend (Node.js + Fastify)

- **Framework**: Fastify para alta performance
- **ORM**: Drizzle ORM com PostgreSQL
- **Armazenamento**: Cloudflare R2 para arquivos CSV
- **Validação**: Zod para schemas de validação

### Frontend (React + TypeScript)

- **Framework**: React 18 com TypeScript
- **Styling**: Tailwind CSS
- **Build**: Vite para desenvolvimento rápido

### Banco de Dados

- **Sistema**: PostgreSQL
- **Migrações**: Drizzle Kit
- **Schema**: Links, relatórios e índices otimizados

## 🚀 Quick Start

### Pré-requisitos

- Node.js 18+
- PostgreSQL 14+
- Docker (opcional)

### 1. Clone o Repositório

```bash
git clone <repository-url>
cd brevly
```

### 2. Configure o Backend

```bash
cd server
cp env.example .env
# Edite .env com suas configurações
npm install
npm run db:generate
npm run db:migrate
npm run dev
```

### 3. Configure o Frontend

```bash
cd web
cp env.example .env
# Edite .env com a URL do backend
npm install
npm run dev
```

### 4. Acesse a Aplicação

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3333
- **Health Check**: http://localhost:3333/health

## 📊 API Endpoints

### Links

- `POST /api/links` - Criar novo link
- `GET /api/links` - Listar links com paginação
- `GET /api/links/:id` - Obter link por ID
- `DELETE /api/links/:id` - Deletar link

### Redirecionamento

- `GET /:shortUrl` - Redirecionar e contar acesso

### Relatórios

- `POST /api/reports/csv` - Gerar relatório CSV
- `GET /api/reports` - Listar relatórios

## 🧪 Testes

### Teste de Contagem de Acessos

```bash
cd server
node test-redirect.js
```

### Teste de Conexão com Banco

```bash
cd server
node test-db.js
```

### Teste de Conexão R2

```bash
cd server
npm run test:r2
```

## 🔒 Variáveis de Ambiente

### Backend (.env)

```env
# Banco de Dados
DATABASE_URL=postgresql://user:password@localhost:5432/brevly

# Cloudflare R2
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_ACCESS_KEY_ID=your_access_key
CLOUDFLARE_SECRET_ACCESS_KEY=your_secret_key
CLOUDFLARE_BUCKET=your_bucket_name
CLOUDFLARE_PUBLIC_URL=https://your-domain.com

# Servidor
PORT=3333
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)

```env
VITE_BACKEND_URL=http://localhost:3333
```

## 🐳 Docker

### Executar com Docker Compose

```bash
docker-compose up -d
```

### Executar Apenas o Banco

```bash
docker-compose up -d postgres
```

## 📝 Scripts Disponíveis

### Backend

- `npm run dev` - Desenvolvimento com hot reload
- `npm run build` - Build de produção
- `npm run start` - Executar build de produção
- `npm run db:generate` - Gerar migrações
- `npm run db:migrate` - Aplicar migrações
- `npm run db:studio` - Abrir Drizzle Studio

### Frontend

- `npm run dev` - Desenvolvimento
- `npm run build` - Build de produção
- `npm run preview` - Preview do build

## 🐛 Troubleshooting

Para problemas específicos, consulte o [Guia de Troubleshooting](server/TROUBLESHOOTING.md) no diretório do servidor.

### Problemas Comuns:

1. **Erro de migração**: Execute `npm run db:generate` e `npm run db:migrate`
2. **Erro de conexão**: Verifique se o PostgreSQL está rodando
3. **Erro de CORS**: Confirme as configurações no arquivo .env
4. **Erro de R2**: Verifique as credenciais do Cloudflare

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

Para suporte técnico ou dúvidas:

- Abra uma issue no GitHub
- Consulte o guia de troubleshooting
- Verifique os logs do servidor

---

**Desenvolvido com ❤️ pela equipe Brev.ly**
