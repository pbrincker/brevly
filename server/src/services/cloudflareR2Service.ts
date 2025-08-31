import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { env } from '../config/environment';

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
 * Cliente S3 configurado para Cloudflare R2
 */
const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${env.cloudflareAccountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.cloudflareAccessKeyId,
    secretAccessKey: env.cloudflareSecretAccessKey,
  },
});

/**
 * Serviço para gerenciar uploads e downloads no Cloudflare R2
 */
export class CloudflareR2Service {
  
  /**
   * Faz upload de um arquivo CSV para o R2
   * @param fileName - Nome do arquivo
   * @param content - Conteúdo do arquivo CSV
   * @returns Resultado do upload
   */
  static async uploadCsvReport(fileName: string, content: string): Promise<UploadResult> {
    try {
      const command = new PutObjectCommand({
        Bucket: env.cloudflareBucket,
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
      const publicUrl = `${env.cloudflarePublicUrl}/reports/${fileName}`;

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
   * @param fileName - Nome do arquivo
   * @param expiresIn - Tempo de expiração em segundos (padrão: 1 hora)
   * @returns URL assinada para download
   */
  static async generateDownloadUrl(fileName: string, expiresIn: number = 3600): Promise<DownloadResult> {
    try {
      const command = new GetObjectCommand({
        Bucket: env.cloudflareBucket,
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
   * Verifica se o serviço está configurado corretamente
   * @returns true se configurado, false caso contrário
   */
  static isConfigured(): boolean {
    return !!(
      env.cloudflareAccountId &&
      env.cloudflareAccessKeyId &&
      env.cloudflareSecretAccessKey &&
      env.cloudflareBucket &&
      env.cloudflarePublicUrl
    );
  }
}

/**
 * Instância exportada do serviço
 */
export const cloudflareR2Service = CloudflareR2Service;
