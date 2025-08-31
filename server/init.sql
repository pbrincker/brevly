-- Script de inicialização do banco de dados Brev.ly
-- Este arquivo é executado automaticamente quando o container PostgreSQL é criado

-- Cria o banco de dados se não existir
SELECT 'CREATE DATABASE brevly'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'brevly')\gexec

-- Conecta ao banco de dados
\c brevly;

-- Cria a extensão para UUID se não existir
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Cria a extensão para timestamps se não existir
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Comentário sobre o banco de dados
COMMENT ON DATABASE brevly IS 'Banco de dados para o encurtador de URLs Brev.ly';
