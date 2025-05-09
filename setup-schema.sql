-- SQL script to set up the database schema correctly for the election results application

-- Drop duplicate columns if they exist
ALTER TABLE IF EXISTS electionx_regions DROP COLUMN IF EXISTS "totalStations";
ALTER TABLE IF EXISTS electionx_regions DROP COLUMN IF EXISTS "totalRepresentatives";

-- Make sure the regions table has the correct columns
ALTER TABLE IF EXISTS electionx_regions 
  ADD COLUMN IF NOT EXISTS "total_stations" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "total_representatives" INTEGER NOT NULL DEFAULT 6;

-- Update the regions table with the correct values
UPDATE electionx_regions SET total_stations = 19, total_representatives = 6 WHERE name = 'Region 1';
UPDATE electionx_regions SET total_stations = 24, total_representatives = 6 WHERE name = 'Region 2';
UPDATE electionx_regions SET total_stations = 19, total_representatives = 6 WHERE name = 'Region 3';
UPDATE electionx_regions SET total_stations = 20, total_representatives = 6 WHERE name = 'Region 4';

-- Create an updated schema.ts file for Drizzle ORM
-- You'll need to manually update your src/server/db/schema.ts file with these column names:
/*
export const regions = createTable(
  "regions",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    name: d.varchar({ length: 100 }).notNull(),
    total_stations: d.integer().notNull(),
    total_representatives: d.integer().default(6).notNull(),
    created_at: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  }),
  (t) => [index("region_name_idx").on(t.name)],
);

export const stations = createTable(
  "stations",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    name: d.varchar({ length: 100 }).notNull(),
    region_id: d.integer().notNull().references(() => regions.id),
    created_at: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  }),
  (t) => [
    index("station_name_idx").on(t.name),
    index("station_region_idx").on(t.region_id),
  ],
);

export const candidates = createTable(
  "candidates",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    name: d.varchar({ length: 200 }).notNull(),
    region_id: d.integer().notNull().references(() => regions.id),
    number: d.integer().notNull(), // Candidate number on the ballot
    created_at: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  }),
  (t) => [
    index("candidate_name_idx").on(t.name),
    index("candidate_region_idx").on(t.region_id),
    index("candidate_number_idx").on(t.number),
  ],
);

export const votes = createTable(
  "votes",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    candidate_id: d.integer().notNull().references(() => candidates.id),
    station_id: d.integer().notNull().references(() => stations.id),
    vote_count: d.integer().default(0).notNull(),
    created_at: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updated_at: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [
    index("vote_candidate_idx").on(t.candidate_id),
    index("vote_station_idx").on(t.station_id),
  ],
);
*/
