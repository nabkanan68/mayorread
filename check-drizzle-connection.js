// Script to check database connection using Drizzle ORM
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { regions, stations, candidates, votes } from './src/server/db/schema.js';

// Connection string from your .env file
const connectionString = "postgresql://muaythai_owner:npg_uo1cbjDyXRx0@ep-hidden-morning-a134x57e.ap-southeast-1.aws.neon.tech/electionx?sslmode=require";

async function checkDrizzleConnection() {
  console.log('Testing Drizzle ORM connection...');
  console.log('Connection string:', connectionString);
  
  try {
    // Create a postgres client
    const client = postgres(connectionString, { max: 1 });
    
    // Create a Drizzle instance
    const db = drizzle(client);
    
    console.log('Attempting to query regions table...');
    const result = await db.select().from(regions);
    
    console.log('✅ Connection successful!');
    console.log(`Found ${result.length} regions in the database.`);
    
    // Close the connection
    await client.end();
    console.log('Connection closed.');
  } catch (error) {
    console.error('❌ Connection failed:');
    console.error(error);
  }
}

// Run the test
checkDrizzleConnection();
