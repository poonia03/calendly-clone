const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

function buildPoolConfig() {
  const connectionString = process.env.DATABASE_URL;
  if (connectionString && connectionString.trim()) {
    return {
      connectionString,
      ssl:
        process.env.PGSSLMODE === 'require' || process.env.NODE_ENV === 'production'
          ? { rejectUnauthorized: false }
          : false,
    };
  }

  const host = process.env.PGHOST || 'localhost';
  const port = Number(process.env.PGPORT || 5432);
  const user = process.env.PGUSER || process.env.USER || 'postgres';
  const password = process.env.PGPASSWORD || '';
  const database = process.env.PGDATABASE || 'calendly_clone';

  return {
    host,
    port,
    user,
    password,
    database,
    ssl: process.env.PGSSLMODE === 'require' ? { rejectUnauthorized: false } : false,
  };
}

const pool = new Pool(buildPoolConfig());

pool.on('error', (err) => {
  console.error('Unexpected PostgreSQL pool error:', err);
});

async function testConnection() {
  const client = await pool.connect();
  try {
    await client.query('SELECT 1 AS ok');
    return true;
  } finally {
    client.release();
  }
}

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
  testConnection,
};
