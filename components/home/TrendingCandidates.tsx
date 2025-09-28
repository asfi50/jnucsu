'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronUp, Flame } from 'lucide-react';
import { StudentLeader } from '@/lib/types';
import { useState } from 'react';

interface TrendingCandidatesProps {
  candidates: StudentLeader[];
}

export default function TrendingCandidates({ candidates }: TrendingCandidatesProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center space-x-2 mb-4">
        <Flame className="w-6 h-6 text-red-500 animate-pulse" />
        <h2 className="text-xl font-bold text-gray-900">Trending Candidates</h2>
      </div>
      
      <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
        {candidates.map((candidate) => (
          <TrendingCard key={candidate.id} candidate={candidate} />
        ))}
      </div>
    </div>
  );
}

interface TrendingCardProps {
  candidate: StudentLeader;
}

function TrendingCard({ candidate }: TrendingCardProps) {
  const [votes, setVotes] = useState(candidate.votes);
  const [hasVoted, setHasVoted] = useState(false);

  const handleVote = () => {
    if (!hasVoted) {
      setVotes(votes + 1);
      setHasVoted(true);
    }
  };

  return (
    <Link href={`/candidates/${candidate.id}`} className="group flex-shrink-0">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden w-48 relative">
        {/* Fire indicator for trending */}
        <div className="absolute top-2 right-2 z-10">
          <div className="bg-red-500 text-white p-1 rounded-full animate-bounce">
            <Flame className="w-3 h-3" />
          </div>
        </div>
        
        <div className="p-4 text-center">
          {/* Circular Avatar */}
          <div className="relative mb-3">
            <div className="w-20 h-20 mx-auto rounded-full overflow-hidden ring-2 ring-orange-100">
              <Image
                src={candidate.avatar}
                alt={candidate.name}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Candidate Info */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 group-hover:text-orange-600 transition-colors mb-1 truncate">
              {candidate.name}
            </h3>
            <p className="text-xs text-orange-600 font-medium mb-3 truncate">
              {candidate.title.replace(' - JnUCSU', '')}
            </p>
            
            {/* Vote Count */}
            <button
              onClick={(e) => {
                e.preventDefault();
                handleVote();
              }}
              className={`flex items-center justify-center space-x-1 text-sm w-full transition-colors ${
                hasVoted 
                  ? 'text-orange-600 bg-orange-50' 
                  : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
              } px-3 py-2 rounded-lg`}
            >
              <ChevronUp className="w-4 h-4" />
              <span className="font-medium">{votes}</span>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}