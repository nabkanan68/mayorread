"use client";

import React, { useState } from "react";
import { api } from "~/trpc/react";

interface VoteEntryProps {
  regionId: number;
}

export default function VoteEntry({ regionId }: VoteEntryProps) {
  const [selectedStation, setSelectedStation] = useState<number>(0);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  // Fetch stations for the selected region
  const { data: stations } = api.regions.getStations.useQuery({ regionId }, {
    enabled: regionId > 0
  });

  // Fetch candidates for the selected region
  const { data: candidates } = api.candidates.getByRegion.useQuery({ regionId }, {
    enabled: regionId > 0
  });

  // Fetch existing votes for the selected station
  const { data: existingVotes, refetch: refetchVotes } = api.votes.getByStation.useQuery(
    { stationId: selectedStation },
    { enabled: selectedStation > 0 }
  );

  // Create a mutation for updating votes
  const updateVoteMutation = api.votes.upsertVote.useMutation({
    onSuccess: () => {
      // Using void to explicitly mark this promise as intentionally not awaited
      void refetchVotes();
      setMessage({ type: "success", text: "Vote data saved successfully" });
      setTimeout(() => setMessage(null), 3000);
    },
    onError: (error) => {
      setMessage({ type: "error", text: `Error: ${error.message}` });
    },
    onSettled: () => {
      setSaving(false);
    }
  });

  // Handle vote form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedStation) return;

    setSaving(true);
    const formData = new FormData(event.currentTarget);
    
    // Process each candidate's vote count
    const promises = candidates?.map(async (candidate) => {
      const voteCountStr = formData.get(`vote-${candidate.id}`) as string;
      const voteCount = parseInt(voteCountStr, 10) || 0;

      return updateVoteMutation.mutateAsync({
        stationId: selectedStation,
        candidateId: candidate.id,
        voteCount
      });
    });
    
    if (promises) {
      // Properly await the Promise.all to satisfy ESLint
      await Promise.all(promises).catch(e => {
        console.error("Error saving votes:", e);
      });
    }
  };

  // Find vote count for a candidate from existing votes
  const getVoteCount = (candidateId: number) => {
    if (!existingVotes) return 0;
    const vote = existingVotes.find(v => v.candidate_id === candidateId);
    return vote ? vote.vote_count : 0;
  };

  if (!stations || !candidates) {
    return <div className="p-6">Loading data...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-blue-700 text-white px-6 py-4">
        <h3 className="text-xl font-semibold">
          Enter Vote Data
        </h3>
      </div>
      
      <div className="p-6">
        {/* Station selection */}
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Select Station:</label>
          <select
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedStation || ""}
            onChange={(e) => setSelectedStation(Number(e.target.value))}
          >
            <option value="">-- Select a station --</option>
            {stations.map((station: { id: number; name: string }) => (
              <option key={station.id} value={station.id}>
                {station.name}
              </option>
            ))}
          </select>
        </div>

        {/* Vote entry form */}
        {selectedStation > 0 && (
          <form onSubmit={handleSubmit}>
            <div className="overflow-x-auto">
              <table className="w-full mb-4">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-3 px-4 text-left">No.</th>
                    <th className="py-3 px-4 text-left">Candidate</th>
                    <th className="py-3 px-4 text-right">Vote Count</th>
                  </tr>
                </thead>
                <tbody>
                  {candidates.map((candidate) => (
                    <tr key={candidate.id} className="border-b last:border-0">
                      <td className="py-3 px-4">{candidate.number}</td>
                      <td className="py-3 px-4">{candidate.name}</td>
                      <td className="py-3 px-4 text-right">
                        <input
                          type="number"
                          name={`vote-${candidate.id}`}
                          defaultValue={getVoteCount(candidate.id)}
                          min="0"
                          className="border rounded p-2 w-24 text-right"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {message && (
              <div 
                className={`p-3 mb-4 rounded ${
                  message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
              >
                {message.text}
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className={`px-4 py-2 rounded ${
                  saving 
                    ? "bg-gray-300 cursor-not-allowed" 
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {saving ? "Saving..." : "Save Vote Data"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
