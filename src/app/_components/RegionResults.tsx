"use client";

import React from "react";
import { api } from "~/trpc/react";

interface RegionResultsProps {
  regionId: number;
}

export default function RegionResults({ regionId }: RegionResultsProps) {
  const { data: region } = api.regions.getById.useQuery({ id: regionId });
  const { data: results, isLoading } = api.candidates.getResultsByRegion.useQuery(
    { regionId },
    { refetchInterval: 30000 } // Refetch every 30 seconds
  );

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center">
        <div className="animate-pulse">Loading results...</div>
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-2">No results available yet</h3>
        <p className="text-gray-600">
          Results for this region will appear here once votes are counted.
        </p>
      </div>
    );
  }

  // Calculate total votes for percentage calculation
  const totalVotes = results.reduce((sum, candidate) => {
    const voteCount = typeof candidate.total_votes === 'number' 
      ? candidate.total_votes 
      : Number(candidate.total_votes ?? 0);
    return sum + voteCount;
  }, 0);
  
  // Find highest voted candidate in this region
  const highestVotedIndex = 0; // Since results are already ordered by votes DESC

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-blue-700 text-white px-6 py-4">
        <h3 className="text-xl font-semibold">
          {region?.name} Results
        </h3>
        <p className="text-sm opacity-80">
          Votes for mayoral candidates in this region
        </p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left">Rank</th>
              <th className="py-3 px-4 text-left">No.</th>
              <th className="py-3 px-4 text-left">Candidate</th>
              <th className="py-3 px-4 text-right">Votes</th>
              <th className="py-3 px-4 text-right">Percentage</th>
              <th className="py-3 px-4 text-center">Position</th>
            </tr>
          </thead>
          <tbody>
            {results.map((candidate, index) => (
              <tr 
                key={candidate.candidateId}
                className={`border-b last:border-0 ${
                  index === highestVotedIndex ? "bg-green-50" : ""
                }`}
              >
                <td className="py-3 px-4">{index + 1}</td>
                <td className="py-3 px-4">{candidate.candidateNumber}</td>
                <td className="py-3 px-4 font-medium">{candidate.candidateName}</td>
                <td className="py-3 px-4 text-right">
                  {typeof candidate.total_votes === 'number' 
                    ? candidate.total_votes.toLocaleString() 
                    : Number(candidate.total_votes ?? 0).toLocaleString()}
                </td>
                <td className="py-3 px-4 text-right">
                  {totalVotes > 0
                    ? `${((Number(candidate.total_votes ?? 0) / totalVotes) * 100).toFixed(2)}%`
                    : "0.00%"}
                </td>
                <td className="py-3 px-4 text-center">
                  {index === highestVotedIndex && totalVotes > 0 ? (
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
  );
}
