import { createPool } from '@vercel/postgres';

// Neon integration may create DATABASE_URL / DATABASE_URL_UNPOOLED
// or a custom-prefixed *_URL (e.g. STORAGE_URL). We support all.
const connectionString =
  process.env.STORAGE_URL ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_PRISMA_URL;

if (!connectionString) {
  throw new Error(
    'Database connection string missing. Expected one of STORAGE_URL, DATABASE_URL, POSTGRES_URL, POSTGRES_PRISMA_URL.'
  );
}

export const db = createPool({
  connectionString,
});


