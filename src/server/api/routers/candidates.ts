import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { db } from "~/server/db";
import { candidates, votes } from "~/server/db/schema";
import { eq, and, sql } from "drizzle-orm";

export const candidatesRouter = createTRPCRouter({
  // Get all candidates
  getAll: publicProcedure.query(async () => {
    return db.query.candidates.findMany({
      orderBy: (candidates, { asc }) => [asc(candidates.region_id), asc(candidates.number)],
      with: {
        region: true,
      },
    });
  }),

  // Get candidates by region
  getByRegion: publicProcedure
    .input(z.object({ regionId: z.number() }))
    .query(async ({ input }) => {
      return db.query.candidates.findMany({
        where: eq(candidates.region_id, input.regionId),
        orderBy: (candidates, { asc }) => [asc(candidates.number)],
        with: {
          region: true,
        },
      });
    }),

  // Get election results (total votes) for candidates by region
  getResultsByRegion: publicProcedure
    .input(z.object({ regionId: z.number() }))
    .query(async ({ input }) => {
      // Get all candidates with their total votes across all stations
      const results = await db
        .select({
          candidateId: candidates.id,
          candidateName: candidates.name,
          candidateNumber: candidates.number,
          total_votes: sql`COALESCE(SUM(${votes.vote_count}), 0)`.as("total_votes"),
        })
        .from(candidates)
        .leftJoin(votes, eq(candidates.id, votes.candidate_id))
        .where(eq(candidates.region_id, input.regionId))
        .groupBy(candidates.id, candidates.name, candidates.number)
        .orderBy((cols) => [sql`${cols.total_votes} DESC`]);

      return results;
    }),
});
