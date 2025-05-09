import { relations, sql } from "drizzle-orm";
import { index, pgTableCreator } from "drizzle-orm/pg-core";

/**
 * Election results application schema
 * Schema includes regions, stations, candidates, and their respective votes
 */
export const createTable = pgTableCreator((name) => `electionx_${name}`);

// Regions table
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

// Stations table
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

// Candidates table
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

// Votes table - records votes for each candidate at each station
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

// Posts table for demo purposes
export const posts = createTable(
  "posts",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    name: d.varchar({ length: 256 }).notNull(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  }),
  (t) => [index("post_name_idx").on(t.name)],
);

// Define relations between tables
export const regionsRelations = relations(regions, ({ many }) => ({
  stations: many(stations),
  candidates: many(candidates),
}));

export const stationsRelations = relations(stations, ({ one, many }) => ({
  region: one(regions, {
    fields: [stations.region_id],
    references: [regions.id],
  }),
  votes: many(votes),
}));

export const candidatesRelations = relations(candidates, ({ one, many }) => ({
  region: one(regions, {
    fields: [candidates.region_id],
    references: [regions.id],
  }),
  votes: many(votes),
}));

export const votesRelations = relations(votes, ({ one }) => ({
  candidate: one(candidates, {
    fields: [votes.candidate_id],
    references: [candidates.id],
  }),
  station: one(stations, {
    fields: [votes.station_id],
    references: [stations.id],
  }),
}));
