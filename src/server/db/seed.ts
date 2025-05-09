import { db } from "./index";
import { candidates, regions, stations } from "./schema";

/**
 * Seed script to initialize the database with required data
 */
export async function seed() {
  console.log("Seeding database...");

  // Clear existing data to avoid duplicates
  await db.delete(candidates);
  await db.delete(stations);
  await db.delete(regions);

  // Seed regions
  const [region1, region2, region3, region4] = await Promise.all([
    db
      .insert(regions)
      .values({
        name: "Region 1",
        totalStations: 19,
        totalRepresentatives: 6,
      })
      .returning()
      .then((res) => res[0]),
    db
      .insert(regions)
      .values({
        name: "Region 2",
        totalStations: 24,
        totalRepresentatives: 6,
      })
      .returning()
      .then((res) => res[0]),
    db
      .insert(regions)
      .values({
        name: "Region 3",
        totalStations: 19,
        totalRepresentatives: 6,
      })
      .returning()
      .then((res) => res[0]),
    db
      .insert(regions)
      .values({
        name: "Region 4",
        totalStations: 20,
        totalRepresentatives: 6,
      })
      .returning()
      .then((res) => res[0]),
  ]);

  console.log("Regions seeded");

  // Seed stations for each region
  const stationPromises = [];
  
  // Region 1 - 19 stations
  for (let i = 1; i <= 19; i++) {
    stationPromises.push(
      db.insert(stations).values({
        name: `Station ${i}`,
        regionId: region1.id,
      })
    );
  }

  // Region 2 - 24 stations
  for (let i = 1; i <= 24; i++) {
    stationPromises.push(
      db.insert(stations).values({
        name: `Station ${i}`,
        regionId: region2.id,
      })
    );
  }

  // Region 3 - 19 stations
  for (let i = 1; i <= 19; i++) {
    stationPromises.push(
      db.insert(stations).values({
        name: `Station ${i}`,
        regionId: region3.id,
      })
    );
  }

  // Region 4 - 20 stations
  for (let i = 1; i <= 20; i++) {
    stationPromises.push(
      db.insert(stations).values({
        name: `Station ${i}`,
        regionId: region4.id,
      })
    );
  }

  await Promise.all(stationPromises);
  console.log("Stations seeded");

  // Seed candidates for each region
  const candidatePromises = [];

  // Region 1 - 12 candidates
  for (let i = 1; i <= 12; i++) {
    candidatePromises.push(
      db.insert(candidates).values({
        name: `Candidate ${i} (Region 1)`,
        regionId: region1.id,
        number: i,
      })
    );
  }

  // Region 2 - 13 candidates
  for (let i = 1; i <= 13; i++) {
    candidatePromises.push(
      db.insert(candidates).values({
        name: `Candidate ${i} (Region 2)`,
        regionId: region2.id,
        number: i,
      })
    );
  }

  // Region 3 - 12 candidates
  for (let i = 1; i <= 12; i++) {
    candidatePromises.push(
      db.insert(candidates).values({
        name: `Candidate ${i} (Region 3)`,
        regionId: region3.id,
        number: i,
      })
    );
  }

  // Region 4 - 13 candidates
  for (let i = 1; i <= 13; i++) {
    candidatePromises.push(
      db.insert(candidates).values({
        name: `Candidate ${i} (Region 4)`,
        regionId: region4.id,
        number: i,
      })
    );
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
