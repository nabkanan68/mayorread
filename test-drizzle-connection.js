// Script to test Drizzle ORM connection with different connection string formats
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// Different connection string variants to test
const connectionStrings = [
  // Original connection string
  "postgresql://muaythai_owner:npg_uo1cbjDyXRx0@ep-hidden-morning-a134x57e-pooler.ap-southeast-1.aws.neon.tech/electionx?sslmode=require",
  
  // Without pooler
  "postgresql://muaythai_owner:npg_uo1cbjDyXRx0@ep-hidden-morning-a134x57e.ap-southeast-1.aws.neon.tech/electionx?sslmode=require",
  
  // With explicit port
  "postgresql://muaythai_owner:npg_uo1cbjDyXRx0@ep-hidden-morning-a134x57e-pooler.ap-southeast-1.aws.neon.tech:5432/electionx?sslmode=require",
  
  // With explicit port without pooler
  "postgresql://muaythai_owner:npg_uo1cbjDyXRx0@ep-hidden-morning-a134x57e.ap-southeast-1.aws.neon.tech:5432/electionx?sslmode=require",
];

async function testDrizzleConnections() {
  console.log('Testing Drizzle ORM connections with different connection strings...\n');
  
  for (let i = 0; i < connectionStrings.length; i++) {
    const connectionString = connectionStrings[i];
    console.log(`Testing connection string #${i + 1}:`);
    console.log(connectionString);
    
    try {
      // Create a postgres client
      const sql = postgres(connectionString, { 
        max: 1,
        idle_timeout: 20,
        connect_timeout: 10,
        prepare: false,
      });
      
      // Create a Drizzle ORM instance
      const db = drizzle(sql);
      
      // Test the connection with a simple query
      console.log('Attempting to connect with Drizzle ORM...');
      const result = await db.execute(sql`SELECT current_database() as db_name`);
      
      console.log('✅ Drizzle ORM connection successful!');
      console.log(`Connected to database: ${result[0].db_name}`);
      
      // Check for tables
      const tables = await db.execute(sql`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name
      `);
      
      console.log(`Found ${tables.length} tables in the database:`);
      tables.forEach(table => {
        console.log(`- ${table.table_name}`);
      });
      
      // Close the connection
      await sql.end();
    } catch (error) {
      console.log('❌ Drizzle ORM connection failed:');
      console.error(error.message);
    }
    
    console.log('\n-----------------------------------\n');
  }
}

// Run the test
testDrizzleConnections();
