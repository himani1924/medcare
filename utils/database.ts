import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();
let pool: Pool | null = null;

export const connectToDB = async () => {
  if (pool) {
    console.log('PostgreSQL is already connected');
    return pool;
  }

  try {
    pool = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: Number(process.env.DB_PORT),
    });

    console.log('Connected to PostgreSQL');
    return pool;
  } catch (error) {
    console.error('Error connecting to PostgreSQL:', error);
    throw error;
  }
};

export default connectToDB;
