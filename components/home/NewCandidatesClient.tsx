"use client";

import { useNewCandidates } from "@/hooks/use-candidates";
import NewCandidates from "@/components/home/NewCandidates";
import { TopCandidate } from "@/app/api/candidate/top/route";

interface NewCandidatesClientProps {
  fallbackData?: TopCandidate[];
}

export default function NewCandidatesClient({
  fallbackData = [],
}: NewCandidatesClientProps) {
  const { candidates, loading, error } = useNewCandidates(4);

  if (loading) {
    return (
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          New Candidates
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse"
            >
              <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-3"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2 mx-auto"></div>
                <div className="h-8 bg-gray-300 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return <NewCandidates candidates={fallbackData.slice(0, 4)} />;
  }

  return <NewCandidates candidates={candidates} />;
}
