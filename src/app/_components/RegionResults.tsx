"use client";

import React, { useState } from "react";
import { api } from "~/trpc/react";

interface RegionResultsProps {
  regionId: number;
}

export default function RegionResults({ regionId }: RegionResultsProps) {
  const [expandedStations, setExpandedStations] = useState<Record<number, boolean>>({});
  
  const { data: region } = api.regions.getById.useQuery({ id: regionId });
  const { data: results, isLoading } = api.candidates.getResultsByRegion.useQuery(
    { regionId },
    { refetchInterval: 30000 } // Refetch every 30 seconds
  );
  const { data: stationResults, isLoading: stationsLoading } = api.votes.getVotesByRegion.useQuery(
    { regionId },
    { refetchInterval: 30000 } // Refetch every 30 seconds
  );
  
  const toggleStation = (stationId: number) => {
    setExpandedStations(prev => ({
      ...prev,
      [stationId]: !prev[stationId]
    }));
  };

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
      
      {/* Stations section */}
      <div className="mt-4 px-6 pb-6">
        <h4 className="text-lg font-semibold mb-3">Station Details</h4>
        
        {stationsLoading ? (
          <div className="p-4 flex justify-center">
            <div className="animate-pulse">Loading station data...</div>
          </div>
        ) : stationResults && stationResults.length > 0 ? (
          <div className="space-y-4">
            {stationResults.map((stationData) => (
              <div key={stationData.station.id} className="border rounded-lg overflow-hidden">
                <div 
                  className="bg-gray-100 px-4 py-3 flex justify-between items-center cursor-pointer"
                  onClick={() => toggleStation(stationData.station.id)}
                >
                  <h5 className="font-medium">{stationData.station.name}</h5>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-3">
                      {stationData.votes.reduce((sum, vote) => sum + vote.voteCount, 0).toLocaleString()} total votes
                    </span>
                    <svg 
                      className={`w-5 h-5 transform transition-transform ${expandedStations[stationData.station.id] ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                
                {expandedStations[stationData.station.id] && (
                  <div className="p-3">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="py-2 px-3 text-left">Candidate No.</th>
                            <th className="py-2 px-3 text-left">Candidate Name</th>
                            <th className="py-2 px-3 text-right">Votes</th>
                            <th className="py-2 px-3 text-right">% in Station</th>
                            <th className="py-2 px-3 text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stationData.votes
                            .sort((a, b) => b.voteCount - a.voteCount)
                            .map((vote, idx) => {
                              const totalStationVotes = stationData.votes.reduce((sum, v) => sum + v.voteCount, 0);
                              const percentage = totalStationVotes > 0 
                                ? (vote.voteCount / totalStationVotes) * 100 
                                : 0;
                              
                              return (
                                <tr 
                                  key={vote.candidate.id} 
                                  className={`border-b last:border-0 ${idx === 0 && vote.voteCount > 0 ? 'bg-green-50' : ''}`}
                                >
                                  <td className="py-2 px-3">{vote.candidate.number}</td>
                                  <td className="py-2 px-3 font-medium">{vote.candidate.name}</td>
                                  <td className="py-2 px-3 text-right">{vote.voteCount.toLocaleString()}</td>
                                  <td className="py-2 px-3 text-right">{percentage.toFixed(2)}%</td>
                                  <td className="py-2 px-3 text-center">
                                    {idx === 0 && vote.voteCount > 0 ? (
                                      <span className="inline-block px-1.5 py-0.5 bg-green-100 text-green-800 text-xs font-medium rounded">
                                        Leading
                                      </span>
                                    ) : null}
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-3 text-xs text-gray-500">
                      <div className="flex justify-between">
                        <span>Last updated: {new Date().toLocaleString()}</span>
                        <span>Total votes: {stationData.votes.reduce((sum, vote) => sum + vote.voteCount, 0).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 bg-gray-50 rounded border">
            <p className="text-gray-600">No station data available for this region.</p>
          </div>
        )}
      </div>
    </div>
  );
}
