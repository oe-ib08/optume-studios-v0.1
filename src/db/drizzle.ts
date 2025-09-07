import { config } from "dotenv";
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

config({ path: ".env" }); // or .env.local

// Only initialize database if DATABASE_URL is available
let db: ReturnType<typeof drizzle>;

if (process.env.DATABASE_URL && process.env.DATABASE_URL !== "postgresql://placeholder") {
  db = drizzle(process.env.DATABASE_URL, { schema });
} else {
  // Create a mock database for development/build without real database
  console.warn("DATABASE_URL not configured, using mock database for build");
  db = {} as ReturnType<typeof drizzle>;
}

export { db };
