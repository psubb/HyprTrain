import { Pool } from 'pg';

// Validate required environment variables
const validateDbConfig = () => {
  if (process.env.DATABASE_URL) {
    return true;
  }
  
  const requiredVars = ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.error('Missing required database environment variables:', missing);
    return false;
  }
  
  return true;
};

if (!validateDbConfig()) {
  throw new Error('Database configuration is incomplete. Please check your environment variables.');
}

const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }, // Needed for cloud providers like Neon, Render
    })
  : new Pool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

// Test database connection on startup
pool.on('connect', () => {
  console.log('Database connected successfully');
});

pool.on('error', (err: any) => {
  console.error('Database connection error:', {
    message: err.message,
    code: err.code,
    timestamp: new Date().toISOString(),
  });
});

export default pool;
