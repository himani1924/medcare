import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
dotenv.config();

import { Pool } from 'pg';

let pool: Pool | null = null;

export const connectToDB = async (): Promise<Pool> => {
  if (pool) {
    console.log('PostgreSQL is already connected');
    return pool;
  }

  try {
    pool = new Pool({
      user: process.env.DB_USER || '',
      host: process.env.DB_HOST || '',
      database: process.env.DB_NAME || '',
      password: String(process.env.DB_PASSWORD || ''), 
      port: Number(process.env.DB_PORT) || 5432,
    });

    await pool.connect(); 
    console.log('Connected to PostgreSQL');

    pool.on('error', (err: Error) => {
      console.error('Unexpected error on PostgreSQL client:', err);
      process.exit(-1);
    });

    return pool;
  } catch (error) {
    console.error('Error connecting to PostgreSQL:', error);
    throw error;
  }
};



export default connectToDB;
