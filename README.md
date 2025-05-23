# MayorX - Mayoral Election Results App

This application manages and displays election results for the mayoral election. It tracks votes for 3 mayoral candidates across 4 regions and their polling stations.

## Features
- Overall mayoral election results across all regions
- Region-specific election results
- Polling station vote entry by region
- Real-time results display
- Admin interface for data entry

## Tech Stack
- Next.js 14 (App Router)
- Tailwind CSS for styling
- TypeScript for type safety
- PostgreSQL (via Neon.tech)
- Drizzle ORM for database access
- tRPC for type-safe API

## Setup and Running

1. Install dependencies:
   ```bash
   npm install
   ```

2. Your PostgreSQL connection string is already set in the `.env` file:
   ```
   DATABASE_URL="postgresql://neondb_owner:npg_GtNRg9ni6BYF@ep-withered-river-a1posa7h-pooler.ap-southeast-1.aws.neon.tech/mayorx?sslmode=require"
   ```

3. Run database migrations to create the database schema:
   ```bash
   npx drizzle-kit push:pg
   ```

4. Seed the database with initial regions, stations and candidates:
   ```bash
   npm run db:seed
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) to view the application

## Application Structure

### Pages
- `/` - Main page showing overall mayoral election results and breakdown by region
- `/admin` - Admin interface for entering vote counts by region and station

### Database Schema
- `mayorx_regions`: The 4 electoral regions
- `mayorx_stations`: Polling stations within regions (19-24 stations per region)
- `mayorx_candidates`: The 3 mayoral candidates
- `mayorx_votes`: Vote counts for each candidate at each station

### Development Approaches

This project follows modern web development practices:

- **Server Components**: Uses Next.js App Router with React Server Components
- **Type Safety**: End-to-end type safety with TypeScript and tRPC
- **Modern Data Access**: Uses Drizzle ORM for type-safe database access
- **Real-time Updates**: Auto-refreshing results with configurable intervals
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS

### About Mayoral Election Process

In this election:
- There are 4 regions with multiple polling stations
- Same 3 mayoral candidates across all regions
- Votes are collected at the station level
- Results are aggregated and displayed both overall and by region

## License
MIT

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.
#   e l e c t i o n x  
 