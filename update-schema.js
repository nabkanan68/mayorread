// Script to update the database schema to match our code
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get the database URL from environment variables
const databaseUrl = process.env.DATABASE_URL;
console.log('Using database URL:', databaseUrl);

async function updateSchema() {
  console.log('Checking and updating database schema...');
  
  try {
    // Create a postgres client with SSL enabled (required for Neon)
    const sql = postgres(databaseUrl, { 
      max: 1,
      ssl: true,
      prepare: false,
    });
    
    // Create Drizzle instance
    const db = drizzle(sql);
    
    // Check if totalStations column exists in regions table
    console.log('Checking if totalStations column exists in regions table...');
    const totalStationsExists = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'electionx_regions' 
      AND column_name = 'totalStations'
    `;
    
    if (totalStationsExists.length === 0) {
      console.log('totalStations column does not exist. Adding it...');
      
      // Add totalStations column to regions table
      await sql`
        ALTER TABLE electionx_regions 
        ADD COLUMN "totalStations" INTEGER NOT NULL DEFAULT 0
      `;
      
      console.log('totalStations column added successfully!');
    } else {
      console.log('totalStations column already exists.');
    }
    
    // Check if totalRepresentatives column exists in regions table
    console.log('\nChecking if totalRepresentatives column exists in regions table...');
    const totalRepresentativesExists = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'electionx_regions' 
      AND column_name = 'totalRepresentatives'
    `;
    
    if (totalRepresentativesExists.length === 0) {
      console.log('totalRepresentatives column does not exist. Adding it...');
      
      // Add totalRepresentatives column to regions table
      await sql`
        ALTER TABLE electionx_regions 
        ADD COLUMN "totalRepresentatives" INTEGER NOT NULL DEFAULT 6
      `;
      
      console.log('totalRepresentatives column added successfully!');
    } else {
      console.log('totalRepresentatives column already exists.');
    }
    
    // Close the connection
    await sql.end();
    console.log('\nSchema update completed.');
  } catch (error) {
    console.error('❌ Schema update failed:');
    console.error('Error message:', error?.message);
    if (error?.code) {
      console.error('Error code:', error.code);
    }
  }
}

// Run the update
updateSchema();
