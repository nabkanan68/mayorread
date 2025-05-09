import { db } from "./index";
import { candidates, regions, stations } from "./schema";
import { sql } from "drizzle-orm";

/**
 * Seed script to initialize the database with required data
 */
export async function seed() {
  console.log("Seeding database...");

  // Clear existing data to avoid duplicates
  // Using sql`1=1` as a way to delete all rows while satisfying the ESLint rule
  // that requires a where clause
  await db.delete(candidates).where(sql`1=1`);
  await db.delete(stations).where(sql`1=1`);
  await db.delete(regions).where(sql`1=1`);

  // Seed regions
  // Using non-null assertion since we're inserting and returning the regions
  const [region1, region2, region3, region4] = await Promise.all([
    db
      .insert(regions)
      .values({
        name: "Region 1",
        total_stations: 19,
        total_representatives: 6,
      })
      .returning()
      .then((res) => res[0]),
    db
      .insert(regions)
      .values({
        name: "Region 2",
        total_stations: 24,
        total_representatives: 6,
      })
      .returning()
      .then((res) => res[0]),
    db
      .insert(regions)
      .values({
        name: "Region 3",
        total_stations: 19,
        total_representatives: 6,
      })
      .returning()
      .then((res) => res[0]),
    db
      .insert(regions)
      .values({
        name: "Region 4",
        total_stations: 20,
        total_representatives: 6,
      })
      .returning()
      .then((res) => res[0]),
  ]);

  console.log("Regions seeded");

  // Seed stations for each region
  const stationPromises = [];
  
  // Region 1 - 19 stations
  if (region1) {
    for (let i = 1; i <= 19; i++) {
      stationPromises.push(
        db.insert(stations).values({
          name: `Station ${i}`,
          region_id: region1.id,
        })
      );
    }
  }

  // Region 2 - 24 stations
  if (region2) {
    for (let i = 1; i <= 24; i++) {
      stationPromises.push(
        db.insert(stations).values({
          name: `Station ${i}`,
          region_id: region2.id,
        })
      );
    }
  }

  // Region 3 - 19 stations
  if (region3) {
    for (let i = 1; i <= 19; i++) {
      stationPromises.push(
        db.insert(stations).values({
          name: `Station ${i}`,
          region_id: region3.id,
        })
      );
    }
  }

  // Region 4 - 20 stations
  if (region4) {
    for (let i = 1; i <= 20; i++) {
      stationPromises.push(
        db.insert(stations).values({
          name: `Station ${i}`,
          region_id: region4.id,
        })
      );
    }
  }

  await Promise.all(stationPromises);
  console.log("Stations seeded");

  // Seed candidates for each region
  const candidatePromises = [];

  // Region 1 - 12 candidates
  if (region1) {
    for (let i = 1; i <= 12; i++) {
      candidatePromises.push(
        db.insert(candidates).values({
          name: `Candidate ${i} (Region 1)`,
          region_id: region1.id,
          number: i,
        })
      );
    }
  }

  // Region 2 - 13 candidates
  if (region2) {
    for (let i = 1; i <= 13; i++) {
      candidatePromises.push(
        db.insert(candidates).values({
          name: `Candidate ${i} (Region 2)`,
          region_id: region2.id,
          number: i,
        })
      );
    }
  }

  // Region 3 - 12 candidates
  if (region3) {
    for (let i = 1; i <= 12; i++) {
      candidatePromises.push(
        db.insert(candidates).values({
          name: `Candidate ${i} (Region 3)`,
          region_id: region3.id,
          number: i,
        })
      );
    }
  }

  // Region 4 - 13 candidates
  if (region4) {
    for (let i = 1; i <= 13; i++) {
      candidatePromises.push(
        db.insert(candidates).values({
          name: `Candidate ${i} (Region 4)`,
          region_id: region4.id,
          number: i,
        })
      );
    }
  }

  await Promise.all(candidatePromises);
  console.log("Candidates seeded");

  console.log("Database seeded successfully!");
}

// Run the seed function if this file is executed directly
if (require.main === module) {
  seed()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("Error seeding database:", error);
      process.exit(1);
    });
}
