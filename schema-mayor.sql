-- IMPORTANT: Run this script in pgAdmin after connecting to your Neon.tech PostgreSQL server

-- Step 1: Create the tables for the mayoral election application

-- Regions table
CREATE TABLE IF NOT EXISTS "mayorx_regions" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(100) NOT NULL,
  "total_stations" INTEGER NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create index on region name
CREATE INDEX IF NOT EXISTS "region_name_idx" ON "mayorx_regions" ("name");

-- Stations table
CREATE TABLE IF NOT EXISTS "mayorx_stations" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(100) NOT NULL,
  "region_id" INTEGER NOT NULL REFERENCES "mayorx_regions" ("id"),
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes on station name and region
CREATE INDEX IF NOT EXISTS "station_name_idx" ON "mayorx_stations" ("name");
CREATE INDEX IF NOT EXISTS "station_region_idx" ON "mayorx_stations" ("region_id");

-- Candidates table (for mayoral candidates - only 3 total)
CREATE TABLE IF NOT EXISTS "mayorx_candidates" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(200) NOT NULL,
  "number" INTEGER NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes on candidate name and number
CREATE INDEX IF NOT EXISTS "candidate_name_idx" ON "mayorx_candidates" ("name");
CREATE INDEX IF NOT EXISTS "candidate_number_idx" ON "mayorx_candidates" ("number");

-- Votes table - records votes for each candidate at each station
CREATE TABLE IF NOT EXISTS "mayorx_votes" (
  "id" SERIAL PRIMARY KEY,
  "candidate_id" INTEGER NOT NULL REFERENCES "mayorx_candidates" ("id"),
  "station_id" INTEGER NOT NULL REFERENCES "mayorx_stations" ("id"),
  "vote_count" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP WITH TIME ZONE
);

-- Create indexes on votes
CREATE INDEX IF NOT EXISTS "vote_candidate_idx" ON "mayorx_votes" ("candidate_id");
CREATE INDEX IF NOT EXISTS "vote_station_idx" ON "mayorx_votes" ("station_id");

-- Step 2: Seed the database with initial data

-- Clear existing data to avoid duplicates
TRUNCATE "mayorx_votes" CASCADE;
TRUNCATE "mayorx_candidates" CASCADE;
TRUNCATE "mayorx_stations" CASCADE;
TRUNCATE "mayorx_regions" CASCADE;

-- Initial seed data for regions
INSERT INTO "mayorx_regions" ("name", "total_stations") VALUES
('Region 1', 19),
('Region 2', 24),
('Region 3', 19),
('Region 4', 20);

-- Create stations for Region 1
DO $$
BEGIN
  FOR i IN 1..19 LOOP
    INSERT INTO "mayorx_stations" ("name", "region_id")
    VALUES ('Station ' || i, (SELECT id FROM "mayorx_regions" WHERE name = 'Region 1'));
  END LOOP;
END $$;

-- Create stations for Region 2
DO $$
BEGIN
  FOR i IN 1..24 LOOP
    INSERT INTO "mayorx_stations" ("name", "region_id")
    VALUES ('Station ' || i, (SELECT id FROM "mayorx_regions" WHERE name = 'Region 2'));
  END LOOP;
END $$;

-- Create stations for Region 3
DO $$
BEGIN
  FOR i IN 1..19 LOOP
    INSERT INTO "mayorx_stations" ("name", "region_id")
    VALUES ('Station ' || i, (SELECT id FROM "mayorx_regions" WHERE name = 'Region 3'));
  END LOOP;
END $$;

-- Create stations for Region 4
DO $$
BEGIN
  FOR i IN 1..20 LOOP
    INSERT INTO "mayorx_stations" ("name", "region_id")
    VALUES ('Station ' || i, (SELECT id FROM "mayorx_regions" WHERE name = 'Region 4'));
  END LOOP;
END $$;

-- Create the 3 mayoral candidates
INSERT INTO "mayorx_candidates" ("name", "number") VALUES
('Mayoral Candidate 1', 1),
('Mayoral Candidate 2', 2),
('Mayoral Candidate 3', 3);

-- Create views for reporting

-- View for showing total votes by candidate
CREATE OR REPLACE VIEW "mayorx_candidate_totals" AS
SELECT 
  c.id AS candidate_id,
  c.name AS candidate_name,
  c.number AS candidate_number,
  SUM(v.vote_count) AS total_votes
FROM "mayorx_candidates" c
LEFT JOIN "mayorx_votes" v ON c.id = v.candidate_id
GROUP BY c.id, c.name, c.number
ORDER BY total_votes DESC;

-- View for showing total votes by region and candidate
CREATE OR REPLACE VIEW "mayorx_region_results" AS
SELECT 
  r.id AS region_id,
  r.name AS region_name,
  c.id AS candidate_id,
  c.name AS candidate_name,
  c.number AS candidate_number,
  SUM(v.vote_count) AS total_votes
FROM "mayorx_regions" r
CROSS JOIN "mayorx_candidates" c
LEFT JOIN "mayorx_stations" s ON r.id = s.region_id
LEFT JOIN "mayorx_votes" v ON s.id = v.station_id AND c.id = v.candidate_id
GROUP BY r.id, r.name, c.id, c.name, c.number
ORDER BY r.id, total_votes DESC;
