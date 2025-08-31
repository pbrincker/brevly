import dotenv from 'dotenv';

// Carrega as variáveis de ambiente
dotenv.config();

console.log('🔍 Debugando variáveis de ambiente...\n');

console.log('CLOUDFLARE_ACCOUNT_ID:', process.env.CLOUDFLARE_ACCOUNT_ID);
console.log('CLOUDFLARE_ACCESS_KEY_ID:', process.env.CLOUDFLARE_ACCESS_KEY_ID);
console.log('CLOUDFLARE_SECRET_ACCESS_KEY:', process.env.CLOUDFLARE_SECRET_ACCESS_KEY ? '***HIDDEN***' : 'undefined');
console.log('CLOUDFLARE_BUCKET:', process.env.CLOUDFLARE_BUCKET);
console.log('CLOUDFLARE_PUBLIC_URL:', process.env.CLOUDFLARE_PUBLIC_URL);

console.log('\n📁 Diretório atual:', process.cwd());
console.log('📄 Arquivo .env existe:', require('fs').existsSync('.env'));

