import React from "react";
import useUserEngagement from "@/hooks/use-user-engagement";
import { Heart, ThumbsUp, Loader2, AlertCircle } from "lucide-react";

interface UserEngagementDisplayProps {
  className?: string;
}

const UserEngagementDisplay: React.FC<UserEngagementDisplayProps> = ({
  className = "",
}) => {
  const {
    userEngagement,
    isLoading,
    error,
    hasReacted,
    hasVoted,
    toggleReaction,
    toggleVote,
    refetch,
  } = useUserEngagement();

  if (isLoading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm text-gray-500">
          Loading engagement data...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center space-x-2 text-red-600 ${className}`}>
        <AlertCircle className="w-4 h-4" />
        <span className="text-sm">{error}</span>
        <button
          onClick={refetch}
          className="text-xs underline hover:no-underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-3">
          Your Engagement
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <Heart className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">
              {userEngagement.reacted.length}
            </div>
            <div className="text-sm text-gray-600">Blogs Liked</div>
          </div>

          <div className="text-center p-3 bg-green-50 rounded-lg">
            <ThumbsUp className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">
              {userEngagement.voted.length}
            </div>
            <div className="text-sm text-gray-600">Candidates Voted</div>
          </div>
        </div>
      </div>

      {/* Example Blog Reaction Button */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h4 className="text-md font-medium text-gray-900 mb-3">
          Test Blog Reaction
        </h4>
        <TestBlogReaction
          blogId="test-blog-1"
          hasReacted={hasReacted}
          toggleReaction={toggleReaction}
        />
      </div>

      {/* Example Candidate Vote Button */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h4 className="text-md font-medium text-gray-900 mb-3">
          Test Candidate Vote
        </h4>
        <TestCandidateVote
          candidateId="test-candidate-1"
          hasVoted={hasVoted}
          toggleVote={toggleVote}
        />
      </div>
    </div>
  );
};

interface TestBlogReactionProps {
  blogId: string;
  hasReacted: (blogId: string) => boolean;
  toggleReaction: (blogId: string) => Promise<boolean>;
}

const TestBlogReaction: React.FC<TestBlogReactionProps> = ({
  blogId,
  hasReacted,
  toggleReaction,
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const isReacted = hasReacted(blogId);

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      await toggleReaction(blogId);
    } catch (error) {
      console.error("Failed to toggle reaction:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 ${
        isReacted
          ? "bg-red-100 text-red-700 hover:bg-red-200"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Heart className={`w-4 h-4 ${isReacted ? "fill-current" : ""}`} />
      )}
      <span>{isReacted ? "Unlike" : "Like"} Blog</span>
    </button>
  );
};

interface TestCandidateVoteProps {
  candidateId: string;
  hasVoted: (candidateId: string) => boolean;
  toggleVote: (candidateId: string) => Promise<boolean>;
}

const TestCandidateVote: React.FC<TestCandidateVoteProps> = ({
  candidateId,
  hasVoted,
  toggleVote,
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const isVoted = hasVoted(candidateId);

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      await toggleVote(candidateId);
    } catch (error) {
      console.error("Failed to toggle vote:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 ${
        isVoted
          ? "bg-green-100 text-green-700 hover:bg-green-200"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <ThumbsUp className={`w-4 h-4 ${isVoted ? "fill-current" : ""}`} />
      )}
      <span>{isVoted ? "Unvote" : "Vote"} Candidate</span>
    </button>
  );
};

export default UserEngagementDisplay;
