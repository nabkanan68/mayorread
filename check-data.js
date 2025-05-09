// Script to check if the database has been seeded with the required data
import postgres from 'postgres';

// Connection string from your .env file
const connectionString = "postgresql://muaythai_owner:npg_uo1cbjDyXRx0@ep-hidden-morning-a134x57e-pooler.ap-southeast-1.aws.neon.tech/electionx?sslmode=require";

async function checkData() {
  console.log('Connecting to database...');
  
  try {
    // Create a postgres client
    const sql = postgres(connectionString, { max: 1 });
    
    // Check regions
    console.log('\nChecking regions:');
    const regions = await sql`SELECT * FROM "electionx_regions" ORDER BY "id"`;
    console.log(`Found ${regions.length} regions`);
    if (regions.length > 0) {
      console.table(regions.map(r => ({ id: r.id, name: r.name, stations: r.total_stations })));
    }
    
    // Check stations
    console.log('\nChecking stations:');
    const stations = await sql`SELECT COUNT(*) as count FROM "electionx_stations"`;
    console.log(`Found ${stations[0].count} stations`);
    
    // Check stations per region
    const stationsPerRegion = await sql`
      SELECT r.name as region_name, COUNT(s.id) as station_count
      FROM "electionx_regions" r
      LEFT JOIN "electionx_stations" s ON r.id = s.region_id
      GROUP BY r.name
      ORDER BY r.name
    `;
    console.table(stationsPerRegion);
    
    // Check candidates
    console.log('\nChecking candidates:');
    const candidates = await sql`SELECT COUNT(*) as count FROM "electionx_candidates"`;
    console.log(`Found ${candidates[0].count} candidates`);
    
    // Check candidates per region
    const candidatesPerRegion = await sql`
      SELECT r.name as region_name, COUNT(c.id) as candidate_count
      FROM "electionx_regions" r
      LEFT JOIN "electionx_candidates" c ON r.id = c.region_id
      GROUP BY r.name
      ORDER BY r.name
    `;
    console.table(candidatesPerRegion);
    
    // Check votes
    console.log('\nChecking votes:');
    const votes = await sql`SELECT COUNT(*) as count FROM "electionx_votes"`;
    console.log(`Found ${votes[0].count} vote records`);
    
    // Close the connection
    await sql.end();
    console.log('\nConnection closed.');
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the function
checkData();
