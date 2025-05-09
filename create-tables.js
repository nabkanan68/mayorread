// Script to create tables directly using postgres
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { regions, stations, candidates, votes } from './src/server/db/schema.js';

// Connection string from your .env file
const connectionString = "postgresql://muaythai_owner:npg_uo1cbjDyXRx0@ep-hidden-morning-a134x57e-pooler.ap-southeast-1.aws.neon.tech/electionx?sslmode=require";

async function createTables() {
  console.log('Connecting to database...');
  
  try {
    // Create a postgres client
    const client = postgres(connectionString);
    const db = drizzle(client);
    
    console.log('Creating tables...');
    
    // Create regions table
    console.log('Creating regions table...');
    await db.execute(`
      CREATE TABLE IF NOT EXISTS "electionx_regions" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR(100) NOT NULL,
        "total_stations" INTEGER NOT NULL,
        "total_representatives" INTEGER NOT NULL DEFAULT 6,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Create stations table
    console.log('Creating stations table...');
    await db.execute(`
      CREATE TABLE IF NOT EXISTS "electionx_stations" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR(100) NOT NULL,
        "region_id" INTEGER NOT NULL REFERENCES "electionx_regions" ("id"),
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Create candidates table
    console.log('Creating candidates table...');
    await db.execute(`
      CREATE TABLE IF NOT EXISTS "electionx_candidates" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR(200) NOT NULL,
        "region_id" INTEGER NOT NULL REFERENCES "electionx_regions" ("id"),
        "number" INTEGER NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Create votes table
    console.log('Creating votes table...');
    await db.execute(`
      CREATE TABLE IF NOT EXISTS "electionx_votes" (
        "id" SERIAL PRIMARY KEY,
        "candidate_id" INTEGER NOT NULL REFERENCES "electionx_candidates" ("id"),
        "station_id" INTEGER NOT NULL REFERENCES "electionx_stations" ("id"),
        "vote_count" INTEGER NOT NULL DEFAULT 0,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP WITH TIME ZONE
      );
    `);
    
    console.log('Tables created successfully!');
    
    // Close the connection
    await client.end();
    console.log('Connection closed.');
  } catch (error) {
    console.error('Error creating tables:', error);
  }
}

// Run the function
createTables();
