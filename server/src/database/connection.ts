import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { env } from '../config/environment';

/**
 * Configuração da conexão com o banco de dados PostgreSQL
 * Utiliza variáveis de ambiente para configuração segura
 */
const connectionString = env.databaseUrl;

// Cliente PostgreSQL
const client = postgres(connectionString, {
  max: 10, // Máximo de conexões no pool
  idle_timeout: 20, // Timeout para conexões ociosas
  connect_timeout: 10, // Timeout para conexão inicial
});

// Instância do Drizzle ORM
export const db = drizzle(client, { schema });

// Função para fechar a conexão (útil para testes e shutdown graceful)
export const closeConnection = async (): Promise<void> => {
  await client.end();
};

// Função para verificar se a conexão está ativa
export const checkConnection = async (): Promise<boolean> => {
  try {
    await client`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Erro ao verificar conexão com banco de dados:', error);
    return false;
  }
};
