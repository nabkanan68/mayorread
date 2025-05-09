import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { db } from "~/server/db";
import { regions, stations } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export const regionsRouter = createTRPCRouter({
  // Get all regions
  getAll: publicProcedure.query(async () => {
    return db.query.regions.findMany({
      orderBy: (regions, { asc }) => [asc(regions.id)],
    });
  }),

  // Get a single region by ID
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return db.query.regions.findFirst({
        where: eq(regions.id, input.id),
      });
    }),
    
  // Get all stations for a region
  getStations: publicProcedure
    .input(z.object({ regionId: z.number() }))
    .query(async ({ input }) => {
      return db.query.stations.findMany({
        where: eq(stations.region_id, input.regionId),
        orderBy: (stations, { asc }) => [asc(stations.name)],
      });
    }),
});
