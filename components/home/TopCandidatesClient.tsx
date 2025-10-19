"use client";

import { useTopCandidates } from "@/hooks/use-candidates";
import CompactCandidateCard from "@/components/home/CompactCandidateCard";
import { TopCandidate } from "@/app/api/candidate/top/route";
import { RefreshCw, AlertCircle, Users } from "lucide-react";
import { useState } from "react";
import { CandidateCardSkeleton } from "@/components/ui/SkeletonLoader";

interface TopCandidatesClientProps {
  initialData?: TopCandidate[];
}

export default function TopCandidatesClient({
  initialData = [],
}: TopCandidatesClientProps) {
  const { candidates, loading, error, refetch } = useTopCandidates(6);
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    await refetch();
    setIsRetrying(false);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <CandidateCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    // If we have initial data, show it with an error notice
    if (initialData.length > 0) {
      return (
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-yellow-600" />
              <span className="text-sm text-yellow-800">
                Unable to load latest data. Showing cached results.
              </span>
            </div>
            <button
              onClick={handleRetry}
              disabled={isRetrying}
              className="text-yellow-600 hover:text-yellow-700 text-sm font-medium flex items-center space-x-1 disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${isRetrying ? "animate-spin" : ""}`}
              />
              <span>Retry</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {initialData.slice(0, 6).map((candidate) => (
              <CompactCandidateCard key={candidate.id} candidate={candidate} />
            ))}
          </div>
        </div>
      );
    }

    // No initial data, show empty state with retry option
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Unable to Load Candidates
        </h3>
        <p className="text-gray-500 mb-4">
          We&apos;re having trouble loading the candidate data. Please try
          again.
        </p>
        <button
          onClick={handleRetry}
          disabled={isRetrying}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 mx-auto disabled:opacity-50"
        >
          <RefreshCw
            className={`w-4 h-4 ${isRetrying ? "animate-spin" : ""}`}
          />
          <span>{isRetrying ? "Retrying..." : "Try Again"}</span>
        </button>
      </div>
    );
  }

  // No candidates available
  if (candidates.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No Candidates Available
        </h3>
        <p className="text-gray-500">
          There are currently no candidates to display. Check back later!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {candidates.map((candidate) => (
        <CompactCandidateCard key={candidate.id} candidate={candidate} />
      ))}
    </div>
  );
}
