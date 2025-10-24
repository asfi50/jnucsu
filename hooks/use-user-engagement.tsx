import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/auth-context";
import useAxios from "./use-axios";

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
  refreshUserEngagement: () => void;
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

  // Sync userEngagement with userProfile data consistently
  useEffect(() => {
    if (!isAuthenticated) {
      setUserEngagement({ reacted: [], voted: [] });
      setIsLoading(false);
      setError(null);
      return;
    }

    if (userProfile) {
      // Always sync from userProfile to ensure consistency
      const newEngagement = {
        reacted: userProfile.reacted || [],
        voted: userProfile.voted || [],
      };

      // Only update if there's a difference to prevent unnecessary re-renders
      setUserEngagement((prev) => {
        if (
          JSON.stringify(prev.reacted) !==
            JSON.stringify(newEngagement.reacted) ||
          JSON.stringify(prev.voted) !== JSON.stringify(newEngagement.voted)
        ) {
          return newEngagement;
        }
        return prev;
      });

      setIsLoading(false);
      setError(null);
    } else {
      setIsLoading(true);
    }
  }, [isAuthenticated, userProfile]);

  // Force refresh from auth context
  const refreshUserEngagement = useCallback(() => {
    if (userProfile) {
      setUserEngagement({
        reacted: userProfile.reacted || [],
        voted: userProfile.voted || [],
      });
    }
  }, [userProfile]);

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

    // Optimistic update - update UI immediately
    const newReacted = isCurrentlyReacted
      ? userEngagement.reacted.filter((id) => id !== blogId)
      : [...userEngagement.reacted, blogId];

    // Update local state immediately for better UX
    setUserEngagement((prev) => ({
      ...prev,
      reacted: newReacted,
    }));

    // Also update userProfile in auth context immediately
    if (userProfile) {
      setUserProfile({
        ...userProfile,
        reacted: newReacted,
      });
    }

    try {
      const response = await axios.post("/api/blog/reaction", {
        blogId,
        reactionType,
      });

      if (response.status === 200) {
        setError(null);
        return !isCurrentlyReacted; // Return new state
      } else {
        throw new Error(response.data?.message || "Failed to toggle reaction");
      }
    } catch (err) {
      // Revert optimistic update on error
      setUserEngagement((prev) => ({
        ...prev,
        reacted: userEngagement.reacted, // Revert to original state
      }));

      if (userProfile) {
        setUserProfile({
          ...userProfile,
          reacted: userEngagement.reacted, // Revert to original state
        });
      }

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

    // Optimistic update - update UI immediately
    const newVoted = isCurrentlyVoted
      ? userEngagement.voted.filter((id) => id !== candidateProfileId)
      : [...userEngagement.voted, candidateProfileId];

    // Update local state immediately for better UX
    setUserEngagement((prev) => ({
      ...prev,
      voted: newVoted,
    }));

    // Also update userProfile in auth context immediately
    if (userProfile) {
      setUserProfile({
        ...userProfile,
        voted: newVoted,
      });
    }

    try {
      const response = await axios.post("/api/candidate/vote", {
        candidateProfileId,
        voteType,
      });

      if (response.status === 200) {
        setError(null);
        return !isCurrentlyVoted; // Return new state
      } else {
        throw new Error(response.data?.message || "Failed to toggle vote");
      }
    } catch (err) {
      // Revert optimistic update on error
      setUserEngagement((prev) => ({
        ...prev,
        voted: userEngagement.voted, // Revert to original state
      }));

      if (userProfile) {
        setUserProfile({
          ...userProfile,
          voted: userEngagement.voted, // Revert to original state
        });
      }

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
    refreshUserEngagement,
  };
}

export default useUserEngagement;
