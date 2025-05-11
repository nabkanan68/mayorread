import Layout from "~/app/_components/Layout";
import RegionResults from "~/app/_components/RegionResults";
import { api } from "~/trpc/server";

export default async function Home() {
  // Use the correct API method for the server component
  const regions = await api.regions.getAll();
  const overallResults = await api.candidates.getOverallResults();
  
  // Calculate total votes for percentage calculation
  const totalVotes = overallResults.reduce((sum, candidate) => {
    return sum + Number(candidate.total_votes ?? 0);
  }, 0);

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Mayoral Election Results(non-official) ผลการเลือกตั้งไม่เป็นทางการ</h1>
        <p className="text-gray-600">
          View the latest results for the mayoral election across all regions.
        </p>
      </div>
      
      {/* Overall results section */}
      <div className="mb-8 bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-blue-800 text-white px-6 py-4">
          <h2 className="text-2xl font-semibold">Overall Results</h2>
          <p className="text-sm opacity-80">Combined results from all regions</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">Position</th>
                <th className="py-3 px-4 text-left">No.</th>
                <th className="py-3 px-4 text-left">Candidate</th>
                <th className="py-3 px-4 text-right">Votes</th>
                <th className="py-3 px-4 text-right">Percentage</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {overallResults.map((candidate, index) => (
                <tr 
                  key={candidate.candidateId}
                  className={`border-b last:border-0 ${index === 0 ? "bg-green-50" : ""}`}
                >
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4">{candidate.candidateNumber}</td>
                  <td className="py-3 px-4 font-medium">{candidate.candidateName}</td>
                  <td className="py-3 px-4 text-right">
                    {Number(candidate.total_votes ?? 0).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {totalVotes > 0
                      ? `${((Number(candidate.total_votes ?? 0) / totalVotes) * 100).toFixed(2)}%`
                      : "0.00%"}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {index === 0 && Number(candidate.total_votes ?? 0) > 0 ? (
                      <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                        Leading
                      </span>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <h2 className="text-2xl font-bold mb-4">Results by Region</h2>
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
