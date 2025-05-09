// Script to check all available databases on the Neon server
import postgres from 'postgres';

// Connection string without specifying a database
const connectionString = "postgresql://muaythai_owner:npg_uo1cbjDyXRx0@ep-hidden-morning-a134x57e-pooler.ap-southeast-1.aws.neon.tech?sslmode=require";

async function checkDatabases() {
  console.log('Connecting to Neon PostgreSQL server...');
  console.log('Connection string:', connectionString);
  
  try {
    // Create a postgres client
    const sql = postgres(connectionString, { 
      max: 1,
      idle_timeout: 20,
      connect_timeout: 10,
      prepare: false,
    });
    
    // List all databases
    console.log('Listing all databases:');
    const databases = await sql`SELECT datname FROM pg_database WHERE datistemplate = false`;
    
    console.log('Available databases:');
    databases.forEach(db => {
      console.log(`- ${db.datname}`);
    });
    
    // Close the connection
    await sql.end();
    console.log('Connection closed.');
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the function
checkDatabases();
