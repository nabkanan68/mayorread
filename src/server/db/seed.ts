/**
 * Seed database with initial data for mayoral election
 * - 4 regions with their stations
 * - 3 mayoral candidates (same candidates for all regions)
 */

import { sql } from "drizzle-orm";
import { db } from "~/server/db";
import { candidates, regions, stations } from "~/server/db/schema";

type RegionType = { id: number; name: string; total_stations: number; created_at?: Date };

export async function seed() {
  try {
    console.log(" Seeding database for mayoral election...");

    // Clear existing data to avoid duplicates
    await db.delete(candidates).where(sql`1=1`);
    await db.delete(stations).where(sql`1=1`);
    await db.delete(regions).where(sql`1=1`);

    // Create regions
    console.log("Creating regions...");
    const regionData = [
      { name: "Region 1", total_stations: 19 },
      { name: "Region 2", total_stations: 24 },
      { name: "Region 3", total_stations: 19 },
      { name: "Region 4", total_stations: 20 },
    ];

    const createdRegions: RegionType[] = [];
    
    for (const data of regionData) {
      const result = await db
        .insert(regions)
        .values(data)
        .returning();
      
      if (result?.[0]) {
        createdRegions.push(result[0] as RegionType);
      }
    }
    
    console.log("Regions seeded successfully");

    // Create stations for each region
    console.log("Creating stations...");
    const stationPromises = [];
    
    for (const region of createdRegions) {
      const stationCount = region.total_stations;
      
      for (let i = 1; i <= stationCount; i++) {
        stationPromises.push(
          db.insert(stations).values({
            name: `Station ${i}`,
            region_id: region.id,
          })
        );
      }
    }
    
    await Promise.all(stationPromises);
    console.log("Stations seeded successfully");

    // Create 3 mayoral candidates
    console.log("Creating mayoral candidates...");
    const candidateNames = [
      "John Smith",
      "Sarah Johnson",
      "Michael Chen"
    ];
    
    const candidatePromises = candidateNames.map((name, index) => 
      db.insert(candidates).values({
        name,
        number: index + 1,
      })
    );
    
    await Promise.all(candidatePromises);
    console.log(" Mayoral election database seeding complete!");
  } catch (error) {
    console.error(" Seeding failed!", error)
  }
}

// The seed function will be called from seed-script.ts
