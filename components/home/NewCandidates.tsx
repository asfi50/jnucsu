'use client';

import { StudentLeader } from '@/lib/types';
import CompactCandidateCard from './CompactCandidateCard';
import { Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface NewCandidatesProps {
  candidates: StudentLeader[];
}

export default function NewCandidates({ candidates }: NewCandidatesProps) {
  if (candidates.length === 0) return null;

  return (
    <section className="mb-8">
      <div className="flex items-center space-x-2 mb-6">
        <Users className="w-5 h-5 text-green-500" />
        <h2 className="text-xl font-bold text-gray-900">New Candidates</h2>
        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
          Recently Joined
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {candidates.map((candidate) => (
          <CompactCandidateCard key={candidate.id} candidate={candidate} />
        ))}
      </div>

      {/* View all candidates button */}
      <div className="mt-6 text-center">
        <Link href="/candidates" className="inline-flex items-center space-x-2 text-orange-600 hover:text-orange-700 font-medium transition-colors group">
          <span>View all candidates</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
}