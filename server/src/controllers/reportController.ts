import { FastifyRequest, FastifyReply } from 'fastify';
import { desc } from 'drizzle-orm';
import * as fastCsv from 'fast-csv';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../database/connection';
import { links, reports } from '../database/schema';
import { cloudflareR2Service } from '../services/cloudflareR2Service';
import { 
  ApiResponse,
  CsvReportResponse
} from '../types';

/**
 * Controller para gerenciar relatórios CSV
 */
export class ReportController {
  
  /**
   * Gera um relatório CSV com todos os links e faz upload para o R2
   */
  static async generateCsvReport(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    try {
      // Busca todos os links ordenados por data de criação
      const allLinks = await db
        .select()
        .from(links)
        .orderBy(desc(links.createdAt));

      if (allLinks.length === 0) {
        return reply.status(404).send({
          success: false,
          error: 'Nenhum link encontrado para gerar relatório'
        } as ApiResponse);
      }

      // Gera nome único para o arquivo com UUID
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const uuid = uuidv4().substring(0, 8);
      const fileName = `brevly-report-${timestamp}-${uuid}.csv`;

      // Gera o conteúdo CSV
      const csvRows = allLinks.map(link => ({
        ID: link.id,
        'URL Original': link.originalUrl,
        'URL Encurtada': link.shortUrl,
        'Contador de Acessos': link.accessCount,
        'Data de Criação': link.createdAt.toISOString(),
        'Data de Atualização': link.updatedAt.toISOString()
      }));

      // Converte para CSV usando fast-csv
      const csvContent = await new Promise<string>((resolve, reject) => {
        const chunks: string[] = [];
        const csvStream = fastCsv.format({ headers: true });
        
        csvStream.on('data', (chunk) => chunks.push(chunk));
        csvStream.on('end', () => resolve(chunks.join('')));
        csvStream.on('error', reject);
        
        csvRows.forEach(row => csvStream.write(row));
        csvStream.end();
      });

      // Faz upload para o R2
      const uploadResult = await cloudflareR2Service.uploadCsvReport(fileName, csvContent);

      if (!uploadResult.success) {
        return reply.status(500).send({
          success: false,
          error: `Erro ao fazer upload para R2: ${uploadResult.error}`
        } as ApiResponse);
      }

      // Salva informações do relatório no banco
      const [newReport] = await db
        .insert(reports)
        .values({
          fileName,
          publicUrl: uploadResult.publicUrl!,
          fileSize: Buffer.byteLength(csvContent, 'utf8')
        })
        .returning();

      if (!newReport) {
        throw new Error('Falha ao salvar relatório no banco de dados');
      }

      // Retorna a resposta com informações do relatório
      const response: CsvReportResponse = {
        id: newReport.id,
        fileName: newReport.fileName,
        publicUrl: newReport.publicUrl,
        fileSize: newReport.fileSize,
        createdAt: newReport.createdAt.toISOString()
      };

      return reply.status(200).send({
        success: true,
        data: response,
        message: 'Relatório CSV gerado e armazenado com sucesso'
      } as ApiResponse<CsvReportResponse>);

    } catch (error) {
      console.error('Erro ao gerar relatório CSV:', error);
      return reply.status(500).send({
        success: false,
        error: 'Erro interno do servidor'
      } as ApiResponse);
    }
  }

  /**
   * Lista todos os relatórios CSV gerados
   */
  static async getCsvReports(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    try {
      const allReports = await db
        .select()
        .from(reports)
        .orderBy(desc(reports.createdAt));

      const response = allReports.map(report => ({
        id: report.id,
        fileName: report.fileName,
        publicUrl: report.publicUrl,
        fileSize: report.fileSize,
        createdAt: report.createdAt.toISOString()
      }));

      return reply.send({
        success: true,
        data: response
      } as ApiResponse<CsvReportResponse[]>);

    } catch (error) {
      console.error('Erro ao listar relatórios CSV:', error);
      return reply.status(500).send({
        success: false,
        error: 'Erro interno do servidor'
      } as ApiResponse);
    }
  }
}
