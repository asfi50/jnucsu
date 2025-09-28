'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronUp, MessageCircle, ExternalLink, Clock } from 'lucide-react';
import { StudentLeader } from '@/lib/types';
import { formatRelativeTime } from '@/lib/utils';
import { useState } from 'react';

interface CandidateCardProps {
  candidate: StudentLeader;
}

export default function CandidateCard({ candidate }: CandidateCardProps) {
  const [votes, setVotes] = useState(candidate.votes);
  const [hasVoted, setHasVoted] = useState(false);

  const handleVote = () => {
    if (!hasVoted) {
      setVotes(votes + 1);
      setHasVoted(true);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-sm">
      <div className="p-6">
        <div className="flex items-start space-x-4">
          {/* Vote Section */}
          <div className="flex flex-col items-center space-y-1">
            <button
              onClick={handleVote}
              className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                hasVoted 
                  ? 'bg-orange-100 text-orange-600' 
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
              disabled={hasVoted}
            >
              <ChevronUp className="w-5 h-5" />
              <span className="text-sm font-medium">{votes}</span>
            </button>
          </div>

          {/* Candidate Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <Image
                  src={candidate.avatar}
                  alt={candidate.name}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div className="min-w-0 flex-1">
                  <Link 
                    href={`/candidates/${candidate.id}`}
                    className="group"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                      {candidate.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-orange-600 font-medium">
                    {candidate.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    {candidate.department} • Year {candidate.year}
                  </p>
                </div>
              </div>
              
              <Link 
                href={`/candidates/${candidate.id}`}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </Link>
            </div>

            <p className="mt-3 text-gray-700 leading-relaxed">
              {candidate.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-3">
              {candidate.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>{candidate.comments.length} comments</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{formatRelativeTime(candidate.updatedAt)}</span>
                </div>
              </div>
              
              <Link
                href={`/candidates/${candidate.id}`}
                className="text-orange-600 hover:text-orange-700 text-sm font-medium transition-colors"
              >
                View Profile →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}