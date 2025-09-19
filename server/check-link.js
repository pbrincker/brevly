const postgres = require('postgres');

async function checkLink() {
  const sql = postgres('postgresql://brevly_user:brevly_password@postgres:5432/brevly', {
    max: 1,
    connect_timeout: 10,
  });

  try {
    console.log('Verificando se existe link com shortUrl "teste1"...');

    const result = await sql`
      SELECT * FROM links
      WHERE short_url = 'teste1'
    `;

    console.log('Resultado:', result);

    if (result.length === 0) {
      console.log('Nenhum link encontrado com shortUrl "teste1"');
      
      // Listar todos os links para debug
      const allLinks = await sql`SELECT * FROM links`;
      console.log('Todos os links no banco:', allLinks);
    }
    
  } catch (error) {
    console.error('Erro:', error);
  } finally {
    await sql.end();
  }
}

checkLink();

