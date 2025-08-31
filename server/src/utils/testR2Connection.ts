import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import dotenv from 'dotenv';

// Carrega as variáveis de ambiente
dotenv.config();

/**
 * Interface para resposta de upload
 */
interface UploadResult {
  success: boolean;
  publicUrl?: string;
  error?: string;
}

/**
 * Interface para resposta de download
 */
interface DownloadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Verifica se o serviço está configurado corretamente
 */
function isConfigured(): boolean {
  return !!(
    process.env.CLOUDFLARE_ACCOUNT_ID &&
    process.env.CLOUDFLARE_ACCESS_KEY_ID &&
    process.env.CLOUDFLARE_SECRET_ACCESS_KEY &&
    process.env.CLOUDFLARE_BUCKET &&
    process.env.CLOUDFLARE_PUBLIC_URL
  );
}

/**
 * Cliente S3 configurado para Cloudflare R2
 */
const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY!,
  },
});

/**
 * Faz upload de um arquivo CSV para o R2
 */
async function uploadCsvReport(fileName: string, content: string): Promise<UploadResult> {
  try {
    const command = new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_BUCKET,
      Key: `reports/${fileName}`,
      Body: content,
      ContentType: 'text/csv',
      ContentDisposition: `attachment; filename="${fileName}"`,
      Metadata: {
        'generated-at': new Date().toISOString(),
        'content-type': 'text/csv'
      }
    });

    await s3Client.send(command);

    // Gera URL pública para o arquivo
    const publicUrl = `${process.env.CLOUDFLARE_PUBLIC_URL}/reports/${fileName}`;

    return {
      success: true,
      publicUrl
    };

  } catch (error) {
    console.error('Erro ao fazer upload para R2:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido no upload'
    };
  }
}

/**
 * Gera URL assinada para download de um arquivo
 */
async function generateDownloadUrl(fileName: string, expiresIn: number = 3600): Promise<DownloadResult> {
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.CLOUDFLARE_BUCKET,
      Key: `reports/${fileName}`,
    });

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn });

    return {
      success: true,
      url: signedUrl
    };

  } catch (error) {
    console.error('Erro ao gerar URL de download:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido ao gerar URL'
    };
  }
}

/**
 * Testa a conexão com o Cloudflare R2
 */
export async function testR2Connection(): Promise<void> {
  console.log('🔍 Testando conexão com Cloudflare R2...\n');

  try {
    // Verifica se as configurações estão presentes
    if (!isConfigured()) {
      console.error('❌ Configuração do R2 incompleta!');
      console.log('Verifique se todas as variáveis de ambiente estão definidas:');
      console.log('- CLOUDFLARE_ACCOUNT_ID');
      console.log('- CLOUDFLARE_ACCESS_KEY_ID');
      console.log('- CLOUDFLARE_SECRET_ACCESS_KEY');
      console.log('- CLOUDFLARE_BUCKET');
      console.log('- CLOUDFLARE_PUBLIC_URL');
      return;
    }

    console.log('✅ Configuração do R2 encontrada');
    console.log(`📦 Bucket: ${process.env.CLOUDFLARE_BUCKET}`);
    console.log(`🌐 Endpoint: https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`);

    // Testa upload de um arquivo de teste
    const testFileName = `test-${Date.now()}.txt`;
    const testContent = 'Este é um arquivo de teste para verificar a conexão com o R2.';

    console.log(`📤 Fazendo upload de arquivo de teste: ${testFileName}`);

    const uploadResult = await uploadCsvReport(testFileName, testContent);

    if (uploadResult.success) {
      console.log('✅ Upload realizado com sucesso!');
      console.log(`🔗 URL pública: ${uploadResult.publicUrl}`);
      
      // Testa geração de URL de download
      console.log('🔗 Testando geração de URL de download...');
      const downloadResult = await generateDownloadUrl(testFileName);
      
      if (downloadResult.success) {
        console.log('✅ URL de download gerada com sucesso!');
        console.log(`🔗 URL assinada: ${downloadResult.url}`);
      } else {
        console.error('❌ Erro ao gerar URL de download:', downloadResult.error);
      }
    } else {
      console.error('❌ Erro no upload:', uploadResult.error);
    }

  } catch (error) {
    console.error('❌ Erro ao testar conexão com R2:', error);
  }

  console.log('\n🎯 Teste concluído!');
}

// Executa o teste se o arquivo for executado diretamente
if (require.main === module) {
  testR2Connection();
}
