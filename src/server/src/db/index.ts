import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import dotenv from 'dotenv';
import path from 'path';

// Load .env from server root
dotenv.config({ path: path.join(__dirname, '../../.env') });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set in environment variables');
}

const client = postgres(connectionString);
export const db = drizzle(client, { schema });
