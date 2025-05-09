// Script to test connection to Neon PostgreSQL database
import postgres from 'postgres';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get the database URL from environment variables
const databaseUrl = process.env.DATABASE_URL;
console.log('Using database URL:', databaseUrl);

async function testConnection() {
  console.log('Testing connection to Neon PostgreSQL database...');
  
  try {
    // Create a postgres client with SSL enabled
    const sql = postgres(databaseUrl, { 
      max: 1,
      ssl: true,
      prepare: false,
    });
    
    // Test the connection with a simple query
    console.log('Executing test query...');
    const result = await sql`SELECT current_database() as db_name, current_user as user_name`;
    
    console.log('✅ Connection successful!');
    console.log(`Connected to database: ${result[0].db_name}`);
    console.log(`Connected as user: ${result[0].user_name}`);
    
    // List all tables in the database
    console.log('\nListing all tables in the database:');
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;
    
    if (tables.length === 0) {
      console.log('No tables found in the database.');
    } else {
      console.log(`Found ${tables.length} tables:`);
      tables.forEach(table => {
        console.log(`- ${table.table_name}`);
      });
    }
    
    // Close the connection
    await sql.end();
    console.log('\nConnection closed.');
  } catch (error) {
    console.error('❌ Connection failed:');
    console.error('Error message:', error.message);
    if (error.code) {
      console.error('Error code:', error.code);
    }
  }
}

// Run the test
testConnection();
