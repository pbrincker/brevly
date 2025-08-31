# 🚀 Guia de Configuração do Cloudflare R2

Este guia irá ajudá-lo a configurar o Cloudflare R2 para o projeto Brev.ly.

## 📋 Pré-requisitos

- Conta no Cloudflare (gratuita)
- Acesso à internet
- 10-15 minutos para configuração

## 🔧 Passo a Passo

### 1. Criar conta no Cloudflare

1. Acesse [cloudflare.com](https://cloudflare.com)
2. Clique em "Sign Up"
3. Preencha seus dados e crie a conta
4. Faça login no dashboard

### 2. Acessar o R2 Object Storage

1. No dashboard do Cloudflare, procure por "R2 Object Storage"
2. Clique em "Get started with R2"
3. Aceite os termos de uso
4. Aguarde a ativação (pode levar alguns minutos)

### 3. Criar um Bucket

1. Clique em "Create bucket"
2. Digite um nome para o bucket:
   - **Sugestão**: `brevly-reports` ou `brevly-csv-files`
   - **Importante**: Use apenas letras minúsculas, números e hífens
3. Escolha a região: **"Auto"** (recomendado)
4. Clique em "Create bucket"

### 4. Configurar credenciais de acesso

1. No menu lateral, clique em "Manage R2 API tokens"
2. Clique em "Create API token"
3. Configure o token:
   - **Nome**: `brevly-r2-token`
   - **Permissions**:
     - ✅ Object Read
     - ✅ Object Write
     - ✅ Object Delete
   - **Bucket**: Selecione o bucket que você criou
4. Clique em "Create API token"
5. **⚠️ IMPORTANTE**: Copie e salve:
   - `Access Key ID` 74908cb1666c748aa1c30281b48062f1
   - `Secret Access Key` 131c9e743117eaee72897b5c09642d683aa73da886de7610fbcedbf57bb5b762

### 5. Encontrar o Account ID https://9665dd329850caa8f04e4fe49ffb54e4.r2.cloudflarestorage.com

1. No dashboard do Cloudflare, vá em "Workers & Pages"
2. No canto superior direito, você verá seu Account ID
3. Copie este ID (é uma string de 32 caracteres)

### 6. Configurar domínio público (opcional)

Para URLs públicas dos arquivos:

1. No seu bucket, vá em "Settings"
2. Em "Public URL", clique em "Connect domain" https://pub-a5f40646dcff4a3597cd3428e4a5c05f.r2.dev
3. Configure um domínio personalizado (ex: `files.seudominio.com`)
4. Ou use o domínio padrão do R2 (será algo como `https://pub-xxxxx.r2.dev`)

### 7. Configurar o arquivo .env

1. No diretório `server/`, crie um arquivo `.env`
2. Copie o conteúdo do `env.example`
3. Substitua os valores pelos seus dados reais:

```env
# Configurações do Cloudflare R2
CLOUDFLARE_ACCOUNT_ID=9665dd329850caa8f04e4fe49ffb54e4
CLOUDFLARE_ACCESS_KEY_ID=74908cb1666c748aa1c30281b48062f1
CLOUDFLARE_SECRET_ACCESS_KEY=131c9e743117eaee72897b5c09642d683aa73da886de7610fbcedbf57bb5b762
CLOUDFLARE_BUCKET=brevly-csv-files
CLOUDFLARE_PUBLIC_URL=https://pub-a5f40646dcff4a3597cd3428e4a5c05f.r2.dev
```

### 8. Testar a configuração

Execute o comando de teste:

```bash
cd server
npm run test:r2
```

Se tudo estiver configurado corretamente, você verá:

```
✅ Configuração do R2 encontrada
📤 Fazendo upload de arquivo de teste: test-1234567890.txt
✅ Upload realizado com sucesso!
🔗 URL pública: https://sua-url-publica.com/test-1234567890.txt
🔗 Testando geração de URL de download...
✅ URL de download gerada com sucesso!
```

## 🔍 Solução de Problemas

### Erro: "Configuração do R2 incompleta"

- Verifique se todas as variáveis de ambiente estão definidas
- Confirme se não há espaços extras nos valores

### Erro: "Access Denied"

- Verifique se o Access Key ID e Secret Access Key estão corretos
- Confirme se o token tem as permissões necessárias

### Erro: "Bucket not found"

- Verifique se o nome do bucket está correto
- Confirme se o bucket foi criado na mesma conta

### Erro: "Invalid endpoint"

- Verifique se o CLOUDFLARE_ACCOUNT_ID está correto
- Confirme se não há espaços ou caracteres especiais

## 💡 Dicas Importantes

1. **Segurança**: Nunca compartilhe suas credenciais do R2
2. **Backup**: Salve suas credenciais em um local seguro
3. **Teste**: Sempre teste a configuração antes de usar em produção
4. **Monitoramento**: Acompanhe o uso do R2 no dashboard do Cloudflare

## 📞 Suporte

Se você encontrar problemas:

1. Verifique a [documentação oficial do Cloudflare R2](https://developers.cloudflare.com/r2/)
2. Consulte o [fórum da comunidade](https://community.cloudflare.com/)
3. Abra uma issue no repositório do projeto

---

**🎉 Parabéns!** Seu R2 está configurado e pronto para uso!
