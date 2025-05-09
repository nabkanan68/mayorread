-- IMPORTANT: Run this script in pgAdmin after connecting to your Neon.tech PostgreSQL server

-- Step 1: Create the tables for the election application

-- Regions table
CREATE TABLE IF NOT EXISTS "electionx_regions" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(100) NOT NULL,
  "total_stations" INTEGER NOT NULL,
  "total_representatives" INTEGER NOT NULL DEFAULT 6,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create index on region name
CREATE INDEX IF NOT EXISTS "region_name_idx" ON "electionx_regions" ("name");

-- Stations table
CREATE TABLE IF NOT EXISTS "electionx_stations" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(100) NOT NULL,
  "region_id" INTEGER NOT NULL REFERENCES "electionx_regions" ("id"),
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes on station name and region
CREATE INDEX IF NOT EXISTS "station_name_idx" ON "electionx_stations" ("name");
CREATE INDEX IF NOT EXISTS "station_region_idx" ON "electionx_stations" ("region_id");

-- Candidates table
CREATE TABLE IF NOT EXISTS "electionx_candidates" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(200) NOT NULL,
  "region_id" INTEGER NOT NULL REFERENCES "electionx_regions" ("id"),
  "number" INTEGER NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes on candidate name, region, and number
CREATE INDEX IF NOT EXISTS "candidate_name_idx" ON "electionx_candidates" ("name");
CREATE INDEX IF NOT EXISTS "candidate_region_idx" ON "electionx_candidates" ("region_id");
CREATE INDEX IF NOT EXISTS "candidate_number_idx" ON "electionx_candidates" ("number");

-- Votes table
CREATE TABLE IF NOT EXISTS "electionx_votes" (
  "id" SERIAL PRIMARY KEY,
  "candidate_id" INTEGER NOT NULL REFERENCES "electionx_candidates" ("id"),
  "station_id" INTEGER NOT NULL REFERENCES "electionx_stations" ("id"),
  "vote_count" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP WITH TIME ZONE
);

-- Create indexes on votes
CREATE INDEX IF NOT EXISTS "vote_candidate_idx" ON "electionx_votes" ("candidate_id");
CREATE INDEX IF NOT EXISTS "vote_station_idx" ON "electionx_votes" ("station_id");

-- Step 2: Seed the database with initial data

-- Clear existing data to avoid duplicates
TRUNCATE "electionx_votes" CASCADE;
TRUNCATE "electionx_candidates" CASCADE;
TRUNCATE "electionx_stations" CASCADE;
TRUNCATE "electionx_regions" CASCADE;

-- Initial seed data for regions
INSERT INTO "electionx_regions" ("name", "total_stations", "total_representatives") VALUES
('Region 1', 19, 6),
('Region 2', 24, 6),
('Region 3', 19, 6),
('Region 4', 20, 6);

-- Create stations for Region 1
DO $$
BEGIN
  FOR i IN 1..19 LOOP
    INSERT INTO "electionx_stations" ("name", "region_id")
    VALUES ('Station ' || i, (SELECT id FROM "electionx_regions" WHERE name = 'Region 1'));
  END LOOP;
END $$;

-- Create stations for Region 2
DO $$
BEGIN
  FOR i IN 1..24 LOOP
    INSERT INTO "electionx_stations" ("name", "region_id")
    VALUES ('Station ' || i, (SELECT id FROM "electionx_regions" WHERE name = 'Region 2'));
  END LOOP;
END $$;

-- Create stations for Region 3
DO $$
BEGIN
  FOR i IN 1..19 LOOP
    INSERT INTO "electionx_stations" ("name", "region_id")
    VALUES ('Station ' || i, (SELECT id FROM "electionx_regions" WHERE name = 'Region 3'));
  END LOOP;
END $$;

-- Create stations for Region 4
DO $$
BEGIN
  FOR i IN 1..20 LOOP
    INSERT INTO "electionx_stations" ("name", "region_id")
    VALUES ('Station ' || i, (SELECT id FROM "electionx_regions" WHERE name = 'Region 4'));
  END LOOP;
END $$;

-- Create candidates for Region 1 (12 candidates)
DO $$
BEGIN
  FOR i IN 1..12 LOOP
    INSERT INTO "electionx_candidates" ("name", "region_id", "number")
    VALUES ('Candidate ' || i || ' (Region 1)', 
           (SELECT id FROM "electionx_regions" WHERE name = 'Region 1'),
           i);
  END LOOP;
END $$;

-- Create candidates for Region 2 (13 candidates)
DO $$
BEGIN
  FOR i IN 1..13 LOOP
    INSERT INTO "electionx_candidates" ("name", "region_id", "number")
    VALUES ('Candidate ' || i || ' (Region 2)', 
           (SELECT id FROM "electionx_regions" WHERE name = 'Region 2'),
           i);
  END LOOP;
END $$;

-- Create candidates for Region 3 (12 candidates)
DO $$
BEGIN
  FOR i IN 1..12 LOOP
    INSERT INTO "electionx_candidates" ("name", "region_id", "number")
    VALUES ('Candidate ' || i || ' (Region 3)', 
           (SELECT id FROM "electionx_regions" WHERE name = 'Region 3'),
           i);
  END LOOP;
END $$;

-- Create candidates for Region 4 (13 candidates)
DO $$
BEGIN
  FOR i IN 1..13 LOOP
    INSERT INTO "electionx_candidates" ("name", "region_id", "number")
    VALUES ('Candidate ' || i || ' (Region 4)', 
           (SELECT id FROM "electionx_regions" WHERE name = 'Region 4'),
           i);
  END LOOP;
END $$;
