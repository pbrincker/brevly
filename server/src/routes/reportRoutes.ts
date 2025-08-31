import { FastifyInstance } from 'fastify';
import { ReportController } from '../controllers/reportController';

export async function reportRoutes(fastify: FastifyInstance) {
  fastify.post('/api/reports/csv', ReportController.generateCsvReport);
  fastify.get('/api/reports', ReportController.getCsvReports);
}
