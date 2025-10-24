"use client";

import CompactCandidateCard from "@/components/home/CompactCandidateCard";
import { TopCandidate } from "@/app/api/candidate/top/route";
import { Users } from "lucide-react";
import { CandidateCardSkeleton } from "@/components/ui/SkeletonLoader";

interface TopCandidatesClientProps {
  initialData?: TopCandidate[];
}

export default function TopCandidatesClient({
  initialData,
}: TopCandidatesClientProps) {
  // Primary data source is server-side initialData
  const candidates = initialData || [];

  // Show loading state only if no initial data
  if (!initialData) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <CandidateCardSkeleton key={index} />
        ))}
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
      {candidates.slice(0, 6).map((candidate) => (
        <CompactCandidateCard key={candidate.id} candidate={candidate} />
      ))}
    </div>
  );
}
