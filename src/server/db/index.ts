import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "~/env";
import * as schema from "./schema";

// For preventing multiple connections during development hot reloading
declare global {
  // eslint-disable-next-line no-var
  var cachedConnection: postgres.Sql | undefined;
}

// Use a singleton pattern for the connection
let sql: postgres.Sql;

if (process.env.NODE_ENV === "production") {
  // In production, create a new connection every time
  sql = postgres(env.DATABASE_URL, {
    max: 1, // Use a single connection
    ssl: true, // Enable SSL for Neon.tech
    prepare: false, // Disable prepared statements for better compatibility
  });
} else {
  // In development, reuse the connection across hot reloads
  if (!global.cachedConnection) {
    global.cachedConnection = postgres(env.DATABASE_URL, {
      max: 1,
      ssl: true,
      prepare: false,
    });
  }
  sql = global.cachedConnection;
}

// Create Drizzle ORM instance
export const db = drizzle(sql, { schema });
