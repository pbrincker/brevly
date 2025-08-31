const postgres = require('postgres');

async function testConnection() {
  const sql = postgres('postgresql://brevly_user:brevly_password@localhost:5432/brevly', {
    max: 1,
    connect_timeout: 10,
  });

  try {
    console.log('Testando conexão com o banco de dados...');
    const result = await sql`SELECT 1 as test`;
    console.log('Conexão bem-sucedida!', result);
    
    // Testar se as tabelas existem
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log('Tabelas encontradas:', tables);
    
  } catch (error) {
    console.error('Erro na conexão:', error);
  } finally {
    await sql.end();
  }
}

testConnection();
