import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import useAxios from "./use-axios";

/**
 * User Engagement Hook
 *
 * This hook now uses data directly from the userProfile in auth context
 * instead of making separate API calls to /api/user/engagement.
 *
 * The engagement data (reacted blogs and voted candidates) is fetched
 * when the user profile is loaded in the auth context, eliminating the
 * need for additional API requests.
 */

interface UserEngagementData {
  reacted: string[];
  voted: string[];
}

interface UseUserEngagementReturn {
  userEngagement: UserEngagementData;
  userReactions: string[];
  userVotes: string[];
  isLoading: boolean;
  error: string | null;
  hasReacted: (blogId: string) => boolean;
  hasVoted: (candidateProfileId: string) => boolean;
  toggleReaction: (blogId: string) => Promise<boolean>;
  toggleVote: (candidateProfileId: string) => Promise<boolean>;
  refetch: () => Promise<void>;
}

export function useUserEngagement(): UseUserEngagementReturn {
  const { isAuthenticated, userProfile, setUserProfile } = useAuth();
  const [userEngagement, setUserEngagement] = useState<UserEngagementData>({
    reacted: [],
    voted: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const axios = useAxios();

  // Use data from userProfile instead of separate API call
  useEffect(() => {
    if (!isAuthenticated) {
      setUserEngagement({ reacted: [], voted: [] });
      setIsLoading(false);
      return;
    }

    if (userProfile) {
      setUserEngagement({
        reacted: userProfile.reacted || [],
        voted: userProfile.voted || [],
      });
      setIsLoading(false);
      setError(null);
    } else {
      setIsLoading(true);
    }
  }, [isAuthenticated, userProfile]);

  const refetch = async () => {
    // No longer needed since we use userProfile data directly
    // The userProfile is automatically updated when auth context refetches
  };

  const hasReacted = (blogId: string): boolean => {
    return userEngagement.reacted.includes(blogId);
  };

  const hasVoted = (candidateProfileId: string): boolean => {
    return userEngagement.voted.includes(candidateProfileId);
  };

  const toggleReaction = async (blogId: string): Promise<boolean> => {
    if (!isAuthenticated) {
      throw new Error("User must be authenticated to react");
    }

    const isCurrentlyReacted = hasReacted(blogId);
    const reactionType = isCurrentlyReacted ? "unlike" : "like";

    try {
      const response = await axios.post("/api/blog/reaction", {
        blogId,
        reactionType,
      });

      if (response.status === 200) {
        // Update local state immediately for better UX
        const newReacted = isCurrentlyReacted
          ? userEngagement.reacted.filter((id) => id !== blogId)
          : [...userEngagement.reacted, blogId];

        setUserEngagement((prev) => ({
          ...prev,
          reacted: newReacted,
        }));

        // Also update userProfile in auth context to keep in sync
        if (userProfile) {
          setUserProfile({
            ...userProfile,
            reacted: newReacted,
          });
        }

        setError(null);
        return !isCurrentlyReacted; // Return new state
      } else {
        throw new Error(response.data?.message || "Failed to toggle reaction");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to toggle reaction";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const toggleVote = async (candidateProfileId: string): Promise<boolean> => {
    if (!isAuthenticated) {
      throw new Error("User must be authenticated to vote");
    }

    const isCurrentlyVoted = hasVoted(candidateProfileId);
    const voteType = isCurrentlyVoted ? "unvote" : "upvote";

    try {
      const response = await axios.post("/api/candidate/vote", {
        candidateProfileId,
        voteType,
      });

      if (response.status === 200) {
        // Update local state immediately for better UX
        const newVoted = isCurrentlyVoted
          ? userEngagement.voted.filter((id) => id !== candidateProfileId)
          : [...userEngagement.voted, candidateProfileId];

        setUserEngagement((prev) => ({
          ...prev,
          voted: newVoted,
        }));

        // Also update userProfile in auth context to keep in sync
        if (userProfile) {
          setUserProfile({
            ...userProfile,
            voted: newVoted,
          });
        }

        setError(null);
        return !isCurrentlyVoted; // Return new state
      } else {
        throw new Error(response.data?.message || "Failed to toggle vote");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to toggle vote";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  return {
    userEngagement,
    userReactions: userEngagement.reacted,
    userVotes: userEngagement.voted,
    isLoading,
    error,
    hasReacted,
    hasVoted,
    toggleReaction,
    toggleVote,
    refetch,
  };
}

export default useUserEngagement;
