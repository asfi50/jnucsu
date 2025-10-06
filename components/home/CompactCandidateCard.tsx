'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronUp, MessageCircle } from 'lucide-react';
import { StudentLeader } from '@/lib/types';
import { useState } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import LoginModal from '@/components/ui/LoginModal';

interface CompactCandidateCardProps {
  candidate: StudentLeader;
}

export default function CompactCandidateCard({ candidate }: CompactCandidateCardProps) {
  const [votes, setVotes] = useState(candidate.votes);
  const [hasVoted, setHasVoted] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { isAuthenticated } = useAuth();

  const handleVote = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    if (hasVoted) {
      // Remove vote
      setVotes(votes - 1);
      setHasVoted(false);
    } else {
      // Add vote
      setVotes(votes + 1);
      setHasVoted(true);
    }
  };

  const handleCommentClick = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
    }
  };

  return (
    <Link href={`/candidates/${candidate.id}`} className="group">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer">
        <div className="p-4">
          <div className="flex items-center space-x-4">
            {/* Compact Avatar */}
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-gray-100">
                <Image
                  src={candidate.avatar}
                  alt={candidate.name}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Leader Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors truncate">
                {candidate.name}
              </h3>
              <p className="text-orange-600 font-medium text-sm truncate">
                {candidate.title.replace(' - JnUCSU', '')}
              </p>
              
              {/* Action Buttons */}
              <div className="flex items-center space-x-4 mt-2">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleVote();
                  }}
                  className={`flex items-center space-x-1 text-sm transition-colors ${
                    hasVoted 
                      ? 'text-orange-600 bg-orange-50 font-medium' 
                      : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
                  } px-2 py-1 rounded`}
                  title={hasVoted ? 'Click to remove vote' : 'Click to upvote'}
                >
                  <ChevronUp className="w-4 h-4" />
                  <span>{votes}</span>
                </button>
                
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleCommentClick();
                  }}
                  className="flex items-center space-x-1 text-sm text-gray-600 hover:text-orange-600 transition-colors px-2 py-1 rounded hover:bg-orange-50"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{candidate.comments.length}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        returnUrl={`/candidates/${candidate.id}`}
        message="Please log in to upvote or comment on this candidate."
      />
    </Link>
  );
}