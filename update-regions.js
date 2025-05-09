// Script to update regions with correct totalStations values
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get the database URL from environment variables
const databaseUrl = process.env.DATABASE_URL;
console.log('Using database URL:', databaseUrl);

async function updateRegions() {
  console.log('Updating regions with correct totalStations values...');
  
  try {
    // Create a postgres client with SSL enabled (required for Neon)
    const sql = postgres(databaseUrl, { 
      max: 1,
      ssl: true,
      prepare: false,
    });
    
    // Create Drizzle instance
    const db = drizzle(sql);
    
    // Get all regions
    const regions = await sql`
      SELECT id, name FROM electionx_regions
    `;
    
    console.log(`Found ${regions.length} regions to update.`);
    
    // Update each region with the correct totalStations value
    for (const region of regions) {
      // Count stations for this region
      const stationCount = await sql`
        SELECT COUNT(*) as count FROM electionx_stations WHERE "regionId" = ${region.id}
      `;
      
      const count = stationCount[0]?.count || 0;
      
      // Set totalStations based on region name
      let totalStations = 0;
      if (region.name === 'Region 1') totalStations = 19;
      else if (region.name === 'Region 2') totalStations = 24;
      else if (region.name === 'Region 3') totalStations = 19;
      else if (region.name === 'Region 4') totalStations = 20;
      
      // Update the region
      await sql`
        UPDATE electionx_regions 
        SET "totalStations" = ${totalStations}
        WHERE id = ${region.id}
      `;
      
      console.log(`Updated ${region.name} (ID: ${region.id}) with totalStations = ${totalStations}`);
    }
    
    // Close the connection
    await sql.end();
    console.log('\nRegions update completed successfully!');
  } catch (error) {
    console.error('❌ Regions update failed:');
    console.error('Error message:', error?.message);
    if (error?.code) {
      console.error('Error code:', error.code);
    }
  }
}

// Run the update
updateRegions();
