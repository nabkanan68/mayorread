// Simple script to test database connection
const { Client } = require('pg');

// Connection details from your .env file
const connectionString = "postgresql://muaythai_owner:npg_uo1cbjDyXRx0@ep-hidden-morning-a134x57e-pooler.ap-southeast-1.aws.neon.tech/electionx?sslmode=require";

async function testConnection() {
  const client = new Client({
    connectionString,
  });

  try {
    // Connect to the database
    console.log('Attempting to connect to database...');
    await client.connect();
    
    // Execute a simple query
    console.log('Connection established, executing query...');
    const result = await client.query('SELECT current_database() as db_name');
    
    console.log('Connected to database:', result.rows[0].db_name);
    console.log('Connection successful!');
    
    // List the tables in the database
    console.log('\nChecking for existing tables:');
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    if (tables.rows.length === 0) {
      console.log('No tables found in the database.');
    } else {
      console.log('Tables in the database:');
      tables.rows.forEach(row => {
        console.log(`- ${row.table_name}`);
      });
    }
  } catch (error) {
    console.error('Connection error:', error.message);
  } finally {
    // Close the connection
    await client.end();
    console.log('Connection closed.');
  }
}

testConnection();
