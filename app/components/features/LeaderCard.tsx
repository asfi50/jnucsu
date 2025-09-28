'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronUp, MessageCircle } from 'lucide-react';
import { StudentLeader } from '@/lib/types';
import { useState } from 'react';

interface LeaderCardProps {
  leader: StudentLeader;
}

export default function LeaderCard({ leader }: LeaderCardProps) {
  const [votes, setVotes] = useState(leader.votes);
  const [hasVoted, setHasVoted] = useState(false);

  const handleVote = () => {
    if (!hasVoted) {
      setVotes(votes + 1);
      setHasVoted(true);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col items-center text-center">
          {/* Circular Avatar */}
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-gray-100">
              <Image
                src={leader.avatar}
                alt={leader.name}
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Leader Info */}
          <div className="w-full">
            <Link 
              href={`/leaders/${leader.id}`}
              className="group"
            >
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors mb-1">
                {leader.name}
              </h3>
            </Link>
            <p className="text-orange-600 font-semibold mb-2">
              {leader.title}
            </p>
            <p className="text-sm text-gray-500 mb-3">
              {leader.department} • Year {leader.year}
            </p>
            <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
              {leader.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {leader.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-orange-50 text-orange-600 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Action Section */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              {/* Vote Button */}
              <button
                onClick={handleVote}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  hasVoted 
                    ? 'bg-orange-100 text-orange-600' 
                    : 'bg-gray-50 hover:bg-orange-50 text-gray-600 hover:text-orange-600'
                }`}
                disabled={hasVoted}
              >
                <ChevronUp className="w-4 h-4" />
                <span className="font-semibold">{votes}</span>
              </button>

              {/* Comment Count */}
              <div className="flex items-center space-x-1 text-gray-500">
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm">{leader.comments.length}</span>
              </div>

              {/* View Profile Link */}
              <Link
                href={`/leaders/${leader.id}`}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                View Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}