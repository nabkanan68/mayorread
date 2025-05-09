import Layout from "~/app/_components/Layout";
import RegionResults from "~/app/_components/RegionResults";
import { api } from "~/trpc/server";

export default async function Home() {
  // Use the correct API method for the server component
  const regions = await api.regions.getAll();

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Election Results</h1>
        <p className="text-gray-600">
          View the latest election results by region. Top 6 candidates by votes in each region will be elected as representatives.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {regions.map((region: { id: number; name: string }) => (
          <div key={region.id} className="relative">
            <RegionResults regionId={region.id} />
          </div>
        ))}
      </div>
    </Layout>
  );
}
