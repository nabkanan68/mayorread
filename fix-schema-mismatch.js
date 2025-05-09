// Script to fix the schema mismatch between Drizzle ORM and the database
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get the database URL from environment variables
const databaseUrl = process.env.DATABASE_URL;
console.log('Using database URL:', databaseUrl);

async function fixSchemaMismatch() {
  console.log('Fixing schema mismatch between Drizzle ORM and the database...');
  
  try {
    // Create a postgres client with SSL enabled (required for Neon)
    const sql = postgres(databaseUrl, { 
      max: 1,
      ssl: true,
      prepare: false,
    });
    
    // Create Drizzle instance
    const db = drizzle(sql);
    
    // Step 1: Check if we need to update the schema file
    console.log('\nChecking schema file to update column names...');
    console.log('Please update src/server/db/schema.ts to use snake_case for column names:');
    console.log('- Change "totalStations" to "total_stations"');
    console.log('- Change "totalRepresentatives" to "total_representatives"');
    console.log('- Change "regionId" to "region_id"');
    console.log('- Change "candidateId" to "candidate_id"');
    console.log('- Change "stationId" to "station_id"');
    console.log('- Change "voteCount" to "vote_count"');
    console.log('- Change "createdAt" to "created_at"');
    console.log('- Change "updatedAt" to "updated_at"');
    
    // Step 2: Check if we need to drop the duplicate columns
    const duplicateColumns = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'electionx_regions' 
      AND column_name IN ('totalStations', 'totalRepresentatives')
    `;
    
    if (duplicateColumns.length > 0) {
      console.log('\nFound duplicate columns. Dropping them...');
      
      // Drop the duplicate columns
      for (const column of duplicateColumns) {
        await sql`
          ALTER TABLE electionx_regions 
          DROP COLUMN "${column.column_name}"
        `;
        console.log(`Dropped column ${column.column_name}`);
      }
      
      console.log('Duplicate columns dropped successfully!');
    } else {
      console.log('\nNo duplicate columns found.');
    }
    
    // Step 3: Verify the schema
    console.log('\nVerifying the schema...');
    const columns = await sql`
      SELECT table_name, column_name 
      FROM information_schema.columns 
      WHERE table_schema = 'public'
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
    console.log('\nSchema mismatch fix completed.');
    console.log('IMPORTANT: You need to update the src/server/db/schema.ts file to use snake_case column names!');
  } catch (error) {
    console.error('❌ Schema mismatch fix failed:');
    console.error('Error message:', error?.message || 'Unknown error');
    if (error?.code) {
      console.error('Error code:', error.code);
    }
  }
}

// Run the fix
fixSchemaMismatch();
