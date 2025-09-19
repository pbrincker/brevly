# 🔧 Guia de Troubleshooting - Brev.ly Server

## Problemas Identificados e Soluções

### 1. Erro FST_ERR_CTP_EMPTY_JSON_BODY na Geração de CSV

**Problema**: O frontend estava enviando um body vazio para a rota de geração de CSV, causando erro.

**Solução Implementada**:

- ✅ Corrigida a rota `/api/reports/csv` para não esperar body
- ✅ Atualizado o frontend para não enviar body desnecessário
- ✅ Adicionada validação de schema na rota

**Status**: ✅ RESOLVIDO

### 2. Contagem de Acessos Não Funcionando

**Problema**: A funcionalidade de contagem de acessos estava implementada mas não funcionando corretamente.

**Solução Implementada**:

- ✅ Corrigida a rota de redirecionamento `/:shortUrl`
- ✅ Reorganizada a ordem das rotas para evitar conflitos
- ✅ Removida duplicação de rotas no servidor

**Status**: ✅ RESOLVIDO

### 3. Problemas de Migração do Banco de Dados

**Problema**: Versões desatualizadas do Drizzle causando problemas de migração.

**Solução Implementada**:

- ✅ Mantidas as versões originais que funcionam: `drizzle-orm ^0.29.3` e `drizzle-kit ^0.20.6`
- ✅ Corrigidos os scripts para usar comandos corretos: `generate:pg` e `up:pg`
- ✅ Limpadas migrações antigas e geradas novas compatíveis
- ✅ Criados scripts de atualização automática

**Status**: ✅ RESOLVIDO

## 🚀 Como Aplicar as Correções

### Passo 1: Atualizar Dependências

**Windows:**

```bash
update-dependencies.bat
```

**Linux/Mac:**

```bash
chmod +x update-dependencies.sh
./update-dependencies.sh
```

**Manual:**

```bash
cd server
rm -rf node_modules package-lock.json
npm install
```

### Passo 2: Gerar Novas Migrações

```bash
npm run db:generate
```

### Passo 3: Aplicar Migrações

```bash
npm run db:migrate
```

### Passo 4: Testar Funcionalidades

```bash
# Testar contagem de acessos
node test-redirect.js

# Iniciar servidor
npm run dev
```

## 🧪 Testando as Correções

### Teste de Contagem de Acessos

O script `test-redirect.js` testa automaticamente:

1. ✅ Criação de link
2. ✅ Verificação de contador inicial
3. ✅ Redirecionamento (simula clique)
4. ✅ Verificação de incremento do contador
5. ✅ Limpeza do link de teste

### Teste de Geração de CSV

1. Acesse o frontend
2. Crie alguns links
3. Clique em "Baixar CSV"
4. Verifique se o arquivo é gerado sem erros

## 📋 Checklist de Verificação

- [ ] Dependências atualizadas
- [ ] Migrações aplicadas
- [ ] Servidor iniciando sem erros
- [ ] Contagem de acessos funcionando
- [ ] Geração de CSV funcionando
- [ ] Frontend conectando corretamente

## 🐛 Se Ainda Houver Problemas

### Verificar Logs do Servidor

```bash
npm run dev
# Observar logs de erro no console
```

### Verificar Conexão com Banco

```bash
# Testar conexão
node test-db.js
```

### Verificar Configuração de Ambiente

```bash
# Verificar variáveis de ambiente
cat .env
```

## 📞 Suporte

Se os problemas persistirem após aplicar todas as correções:

1. Verifique se o PostgreSQL está rodando
2. Confirme se as variáveis de ambiente estão corretas
3. Verifique se não há conflitos de porta
4. Execute os scripts de teste para identificar problemas específicos

---

**Última Atualização**: $(date)
**Versão**: 1.0.0
