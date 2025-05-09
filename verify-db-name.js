// Script to verify the database name in Neon.tech
import postgres from 'postgres';

// Parse the connection string to extract database name
const connectionString = "postgresql://muaythai_owner:npg_uo1cbjDyXRx0@ep-hidden-morning-a134x57e-pooler.ap-southeast-1.aws.neon.tech/electionx?sslmode=require";

// Extract database name from connection string
const dbNameMatch = connectionString.match(/\/([^/?]+)(\?|$)/);
const databaseName = dbNameMatch ? dbNameMatch[1] : null;

console.log('Extracted database name:', databaseName);

// Try connecting to the default database (postgres) to list all databases
const defaultConnectionString = connectionString.replace(/\/[^/?]+(\?|$)/, '/postgres$1');

async function listDatabases() {
  console.log('Connecting to default postgres database...');
  console.log('Connection string:', defaultConnectionString);
  
  try {
    // Create a postgres client to the default database
    const sql = postgres(defaultConnectionString, { max: 1 });
    
    // List all databases
    console.log('\nListing all databases:');
    const databases = await sql`SELECT datname FROM pg_database WHERE datistemplate = false ORDER BY datname`;
    
    console.log('Available databases:');
    databases.forEach(db => {
      console.log(`- ${db.datname}${db.datname === databaseName ? ' (current)' : ''}`);
    });
    
    // Close the connection
    await sql.end();
    console.log('\nConnection closed.');
  } catch (error) {
    console.error('Error connecting to default database:', error.message);
  }
}

// Run the function
listDatabases();
