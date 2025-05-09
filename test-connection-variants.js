// Script to test different connection string variants with Neon.tech
import postgres from 'postgres';

// Base connection details
const user = "muaythai_owner";
const password = "npg_uo1cbjDyXRx0";
const host = "ep-hidden-morning-a134x57e";
const poolerHost = "ep-hidden-morning-a134x57e-pooler";
const region = "ap-southeast-1.aws.neon.tech";
const database = "electionx";

// Different connection string variants to test
const connectionStrings = [
  // Original connection string from .env
  `postgresql://${user}:${password}@${poolerHost}.${region}/${database}?sslmode=require`,
  
  // Direct connection without pooler
  `postgresql://${user}:${password}@${host}.${region}/${database}?sslmode=require`,
  
  // Connection with explicit port
  `postgresql://${user}:${password}@${poolerHost}.${region}:5432/${database}?sslmode=require`,
  
  // Connection with explicit port without pooler
  `postgresql://${user}:${password}@${host}.${region}:5432/${database}?sslmode=require`,
  
  // Connection with additional parameters
  `postgresql://${user}:${password}@${poolerHost}.${region}/${database}?sslmode=require&connect_timeout=10`,
];

async function testConnections() {
  console.log('Testing different connection string variants...\n');
  
  for (let i = 0; i < connectionStrings.length; i++) {
    const connectionString = connectionStrings[i];
    console.log(`Testing connection string #${i + 1}:`);
    console.log(connectionString);
    
    try {
      // Create a postgres client with a short timeout
      const sql = postgres(connectionString, { 
        max: 1,
        idle_timeout: 5,
        connect_timeout: 10
      });
      
      // Test the connection with a simple query
      console.log('Attempting to connect...');
      const result = await sql`SELECT current_database() as db_name`;
      
      console.log('✅ Connection successful!');
      console.log(`Connected to database: ${result[0].db_name}`);
      
      // Check for tables
      const tables = await sql`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name
      `;
      
      console.log(`Found ${tables.length} tables in the database.`);
      
      // Close the connection
      await sql.end();
    } catch (error) {
      console.log('❌ Connection failed:');
      console.error(error.message);
    }
    
    console.log('\n-----------------------------------\n');
  }
}

// Run the test
testConnections();
