// Import the postgres client from your project
import postgres from 'postgres';

// Connection string from your .env file
const connectionString = "postgresql://muaythai_owner:npg_uo1cbjDyXRx0@ep-hidden-morning-a134x57e-pooler.ap-southeast-1.aws.neon.tech/electionx?sslmode=require";

async function testConnection() {
  console.log('Attempting to connect to database...');
  
  try {
    // Create a new postgres client
    const sql = postgres(connectionString, { max: 1 });
    
    // Test the connection with a simple query
    const result = await sql`SELECT current_database() as db_name`;
    
    console.log('Connected to database:', result[0].db_name);
    
    // Check for existing tables
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;
    
    if (tables.length === 0) {
      console.log('No tables found in the database.');
    } else {
      console.log('Tables in the database:');
      tables.forEach(row => {
        console.log(`- ${row.table_name}`);
      });
    }
    
    // Close the connection
    await sql.end();
    console.log('Connection closed successfully.');
  } catch (error) {
    console.error('Connection error:', error);
  }
}

// Run the test
testConnection();
