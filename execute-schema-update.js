// Script to execute SQL commands to update the database schema
import postgres from 'postgres';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables
dotenv.config();

// Get the database URL from environment variables
const databaseUrl = process.env.DATABASE_URL || '';
console.log('Using database URL:', databaseUrl);

async function executeSchemaUpdate() {
  console.log('Executing SQL commands to update the database schema...');
  
  try {
    // Create a postgres client with SSL enabled (required for Neon)
    const sql = postgres(databaseUrl, { 
      max: 1,
      ssl: true,
      prepare: false,
    });
    
    // Execute SQL commands to update the schema
    console.log('Dropping duplicate columns if they exist...');
    
    // Check if totalStations column exists
    const totalStationsExists = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'electionx_regions' 
      AND column_name = 'totalStations'
    `;
    
    if (totalStationsExists.length > 0) {
      console.log('Dropping totalStations column...');
      await sql`ALTER TABLE electionx_regions DROP COLUMN "totalStations"`;
    }
    
    // Check if totalRepresentatives column exists
    const totalRepresentativesExists = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'electionx_regions' 
      AND column_name = 'totalRepresentatives'
    `;
    
    if (totalRepresentativesExists.length > 0) {
      console.log('Dropping totalRepresentatives column...');
      await sql`ALTER TABLE electionx_regions DROP COLUMN "totalRepresentatives"`;
    }
    
    // Update the regions table with the correct values
    console.log('Updating regions with correct values...');
    
    // Get all regions
    const regions = await sql`SELECT id, name FROM electionx_regions`;
    
    for (const region of regions) {
      let totalStations = 0;
      
      if (region.name === 'Region 1') totalStations = 19;
      else if (region.name === 'Region 2') totalStations = 24;
      else if (region.name === 'Region 3') totalStations = 19;
      else if (region.name === 'Region 4') totalStations = 20;
      
      await sql`
        UPDATE electionx_regions 
        SET total_stations = ${totalStations}, 
            total_representatives = 6
        WHERE id = ${region.id}
      `;
      
      console.log(`Updated ${region.name} with total_stations=${totalStations}, total_representatives=6`);
    }
    
    // Verify the schema
    console.log('\nVerifying the schema...');
    
    const columns = await sql`
      SELECT table_name, column_name 
      FROM information_schema.columns 
      WHERE table_schema = 'public'
      AND table_name LIKE 'electionx_%'
      ORDER BY table_name, column_name
    `;
    
    console.log('Current database schema:');
    let currentTable = '';
    
    for (const column of columns) {
      if (column.table_name !== currentTable) {
        currentTable = column.table_name;
        console.log(`\n${currentTable}:`);
      }
      console.log(`- ${column.column_name}`);
    }
    
    // Close the connection
    await sql.end();
    console.log('\nSchema update completed successfully!');
  } catch (error) {
    console.error('❌ Schema update failed:');
    if (error && typeof error === 'object' && 'message' in error) {
      console.error('Error message:', error.message);
    }
  }
}

// Run the update
executeSchemaUpdate();
