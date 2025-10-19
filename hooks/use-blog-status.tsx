"use client";

import { useState } from "react";
import useAxios from "./use-axios";

export interface BlogStatusAction {
  versionId: string;
  action?: "withdraw" | "resubmit" | "convert_to_draft";
  rejectionReason?: string;
}

interface ErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export const useBlogStatus = () => {
  const axiosInstance = useAxios();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Submit blog for review
  const submitForReview = async (versionId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post("/api/blog/status", {
        versionId,
      });

      return response.data;
    } catch (err: unknown) {
      const error = err as ErrorResponse;
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to submit blog for review";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Withdraw blog from review (Author only)
  const withdrawFromReview = async (versionId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.put("/api/blog/status", {
        versionId,
        action: "withdraw",
      });

      return response.data;
    } catch (err: unknown) {
      const error = err as ErrorResponse;
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to withdraw blog from review";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Resubmit rejected blog for review
  const resubmitForReview = async (versionId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.put("/api/blog/status", {
        versionId,
        action: "resubmit",
      });

      return response.data;
    } catch (err: unknown) {
      const error = err as ErrorResponse;
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to resubmit blog for review";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Convert rejected blog back to draft
  const convertToDraft = async (versionId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.put("/api/blog/status", {
        versionId,
        action: "convert_to_draft",
      });

      return response.data;
    } catch (err: unknown) {
      const error = err as ErrorResponse;
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to convert blog to draft";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Delete draft blog version
  const deleteDraftVersion = async (versionId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.delete(
        `/api/blog/status?versionId=${versionId}`
      );

      return response.data;
    } catch (err: unknown) {
      const error = err as ErrorResponse;
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete blog version";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Admin: Approve/Reject blog
  const moderateBlog = async (
    versionId: string,
    action: "approve" | "reject",
    rejectionReason?: string
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.patch("/api/blog/status", {
        versionId,
        action,
        rejectionReason,
      });

      return response.data;
    } catch (err: unknown) {
      const error = err as ErrorResponse;
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        `Failed to ${action} blog`;
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Get pending blogs for admin review
  const getPendingBlogs = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get("/api/blog/status");

      return response.data;
    } catch (err: unknown) {
      const error = err as ErrorResponse;
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch pending blogs";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    submitForReview,
    withdrawFromReview,
    resubmitForReview,
    convertToDraft,
    deleteDraftVersion,
    moderateBlog,
    getPendingBlogs,
  };
};
