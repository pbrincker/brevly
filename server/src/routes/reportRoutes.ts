import { FastifyInstance } from 'fastify';
import { ReportController } from '../controllers/reportController';

export async function reportRoutes(fastify: FastifyInstance) {
  // Rota para gerar relatório CSV - não precisa de body
  fastify.post('/api/reports/csv', {
    schema: {
      description: 'Gera um relatório CSV com todos os links',
      tags: ['reports'],
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                fileName: { type: 'string' },
                publicUrl: { type: 'string' },
                fileSize: { type: 'number' },
                createdAt: { type: 'string' }
              }
            },
            message: { type: 'string' }
          }
        }
      }
    }
  }, ReportController.generateCsvReport);
  
  fastify.get('/api/reports', ReportController.getCsvReports);
}
