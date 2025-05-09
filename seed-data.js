// Script to seed the database with initial data
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';

// Connection string from your .env file
const connectionString = "postgresql://muaythai_owner:npg_uo1cbjDyXRx0@ep-hidden-morning-a134x57e-pooler.ap-southeast-1.aws.neon.tech/electionx?sslmode=require";

async function seedData() {
  console.log('Connecting to database...');
  
  try {
    // Create a postgres client
    const client = postgres(connectionString);
    const db = drizzle(client);
    
    console.log('Seeding data...');
    
    // Seed regions
    console.log('Seeding regions...');
    const regionData = [
      { name: 'Region 1', totalStations: 19, totalRepresentatives: 6 },
      { name: 'Region 2', totalStations: 24, totalRepresentatives: 6 },
      { name: 'Region 3', totalStations: 19, totalRepresentatives: 6 },
      { name: 'Region 4', totalStations: 20, totalRepresentatives: 6 }
    ];
    
    for (const region of regionData) {
      await db.execute(`
        INSERT INTO "electionx_regions" ("name", "total_stations", "total_representatives")
        VALUES ('${region.name}', ${region.totalStations}, ${region.totalRepresentatives})
        ON CONFLICT DO NOTHING;
      `);
    }
    
    // Get the regions to use their IDs
    const regions = await db.execute(`SELECT * FROM "electionx_regions" ORDER BY "id";`);
    console.log('Regions seeded:', regions.length);
    
    // Seed stations for each region
    console.log('Seeding stations...');
    for (const region of regions) {
      const stationCount = region.total_stations;
      
      for (let i = 1; i <= stationCount; i++) {
        await db.execute(`
          INSERT INTO "electionx_stations" ("name", "region_id")
          VALUES ('Station ${i}', ${region.id})
          ON CONFLICT DO NOTHING;
        `);
      }
    }
    
    // Seed candidates for each region
    console.log('Seeding candidates...');
    const candidateCounts = {
      'Region 1': 12,
      'Region 2': 13,
      'Region 3': 12,
      'Region 4': 13
    };
    
    for (const region of regions) {
      const candidateCount = candidateCounts[region.name];
      
      for (let i = 1; i <= candidateCount; i++) {
        await db.execute(`
          INSERT INTO "electionx_candidates" ("name", "region_id", "number")
          VALUES ('Candidate ${i} (${region.name})', ${region.id}, ${i})
          ON CONFLICT DO NOTHING;
        `);
      }
    }
    
    console.log('Data seeded successfully!');
    
    // Close the connection
    await client.end();
    console.log('Connection closed.');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
}

// Run the function
seedData();
