"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronUp, MessageCircle } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import useUserEngagement from "@/hooks/use-user-engagement";
import LoginModal from "@/components/ui/LoginModal";
import { useToast } from "@/components/ui/ToastProvider";
import { Candidate } from "@/app/api/candidate/route";

interface CandidateCardProps {
  leader: Candidate;
}

export default function CandidateCard({ leader }: CandidateCardProps) {
  const [votes, setVotes] = useState(leader.votes);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { isAuthenticated } = useAuth();
  const { toggleVote, userVotes } = useUserEngagement();
  const { showToast } = useToast();

  // Check if user has voted for this candidate
  const hasVoted = () => userVotes.includes(leader.id);

  const handleVote = async () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    try {
      const newVoteState = await toggleVote(leader.id);

      // Update votes count based on the new state
      if (newVoteState) {
        setVotes(votes + 1);
      } else {
        setVotes(votes - 1);
      }

      showToast({
        message: newVoteState ? "Vote added!" : "Vote removed!",
        type: "success",
        title: "",
      });
    } catch (error) {
      console.error("Error toggling vote:", error);
      showToast({
        message: "Failed to update vote. Please try again.",
        type: "error",
        title: "",
      });
    }
  };

  const handleCommentClick = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden h-full">
      <div className="p-6 h-full flex flex-col">
        <div className="flex flex-col items-center text-center flex-grow">
          {/* Circular Avatar */}
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-gray-100">
              <Image
                src={leader.image || "/images/default-avatar.svg"}
                alt={leader.name}
                width={96}
                height={96}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/images/default-avatar.svg";
                }}
              />
            </div>
          </div>

          {/* Leader Info */}
          <div className="w-full flex-grow flex flex-col">
            <Link href={`/candidates/${leader.id}`} className="group">
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors mb-1">
                {leader.name}
              </h3>
            </Link>
            <p className="text-orange-600 font-semibold mb-2">
              Competing for{" "}
              {leader.position
                ? leader.position.replace(" - JnUCSU", "")
                : "Position"}
            </p>
            <p className="text-sm text-gray-500 mb-3">
              {leader.department} • Year {leader.year}
            </p>
            <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2 flex-grow">
              {leader.about || "No description available."}
            </p>
          </div>
        </div>

        {/* Action Section - Always at bottom */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
          {/* Vote Button */}
          <button
            onClick={handleVote}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              hasVoted()
                ? "bg-orange-100 text-orange-600"
                : "bg-gray-50 hover:bg-orange-50 text-gray-600 hover:text-orange-600"
            }`}
            title={hasVoted() ? "Click to remove vote" : "Click to upvote"}
          >
            <ChevronUp className="w-4 h-4" />
            <span className="font-semibold">{votes}</span>
          </button>

          {/* Comment Count */}
          <button
            onClick={(e) => {
              e.preventDefault();
              handleCommentClick();
            }}
            className="flex items-center space-x-1 text-gray-500 hover:text-orange-600 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm">{leader.comments}</span>
          </button>

          {/* View Profile Link */}
          <Link
            href={`/candidates/${leader.id}`}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            View Profile
          </Link>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        returnUrl={`/candidates/${leader.id}`}
        message="Please log in to upvote or comment on this candidate."
      />
    </div>
  );
}
