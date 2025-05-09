// Script to create the electionx database
import postgres from 'postgres';

// Connection string to the default database (without specifying electionx)
const connectionString = "postgresql://muaythai_owner:npg_uo1cbjDyXRx0@ep-hidden-morning-a134x57e-pooler.ap-southeast-1.aws.neon.tech?sslmode=require";

async function createDatabase() {
  console.log('Connecting to PostgreSQL server...');
  
  try {
    // Create a postgres client to the default database
    const sql = postgres(connectionString, { max: 1 });
    
    // Check if the electionx database exists
    console.log('Checking if database exists...');
    const result = await sql`
      SELECT datname FROM pg_database WHERE datname = 'electionx'
    `;
    
    if (result.length === 0) {
      console.log('Database does not exist, creating it...');
      // Create the electionx database
      await sql`CREATE DATABASE electionx`;
      console.log('Database "electionx" created successfully!');
    } else {
      console.log('Database "electionx" already exists.');
    }
    
    // Close the connection
    await sql.end();
    console.log('Connection closed.');
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the function
createDatabase();
