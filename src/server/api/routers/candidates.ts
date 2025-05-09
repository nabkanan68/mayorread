import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { db } from "~/server/db";
import { candidates, votes, stations } from "~/server/db/schema";
import { eq, sql } from "drizzle-orm";

export const candidatesRouter = createTRPCRouter({
  // Get all candidates
  getAll: publicProcedure.query(async () => {
    return db.query.candidates.findMany({
      orderBy: (candidates, { asc }) => [asc(candidates.number)],
    });
  }),

  // Get all candidates (no regionId filter since candidates are global)
  getByRegion: publicProcedure
    .input(z.object({ regionId: z.number() }))
    .query(async () => {
      return db.query.candidates.findMany({
        orderBy: (candidates, { asc }) => [asc(candidates.number)],
      });
    }),
  
  // Just get the candidates (used for admin page)
  getCandidates: publicProcedure.query(async () => {
    return db.query.candidates.findMany({
      orderBy: (candidates, { asc }) => [asc(candidates.number)],
    });
  }),

  // Get election results (total votes) for candidates by region
  getResultsByRegion: publicProcedure
    .input(z.object({ regionId: z.number() }))
    .query(async ({ input }) => {
      // Get all candidates with their total votes across stations in this region
      const results = await db
        .select({
          candidateId: candidates.id,
          candidateName: candidates.name,
          candidateNumber: candidates.number,
          total_votes: sql`COALESCE(SUM(${votes.vote_count}), 0)`.as("total_votes"),
        })
        .from(candidates)
        .leftJoin(
          votes, 
          eq(candidates.id, votes.candidate_id)
        )
        .leftJoin(
          stations,
          eq(votes.station_id, stations.id)
        )
        .where(eq(stations.region_id, input.regionId))
        .groupBy(candidates.id, candidates.name, candidates.number)
        .orderBy((cols) => [sql`${cols.total_votes} DESC`]);

      return results;
    }),
    
  // Get overall election results across all regions
  getOverallResults: publicProcedure.query(async () => {
    const results = await db
      .select({
        candidateId: candidates.id,
        candidateName: candidates.name,
        candidateNumber: candidates.number,
        total_votes: sql`COALESCE(SUM(${votes.vote_count}), 0)`.as("total_votes"),
      })
      .from(candidates)
      .leftJoin(votes, eq(candidates.id, votes.candidate_id))
      .groupBy(candidates.id, candidates.name, candidates.number)
      .orderBy((cols) => [sql`${cols.total_votes} DESC`]);

    return results;
  }),
});
