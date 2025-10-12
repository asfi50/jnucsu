import { useState, useCallback } from "react";
import useAxios from "./use-axios";
import {
  SubscribeRequest,
  SubscribeResponse,
  GetSubscribersResponse,
  GetSubscribersParams,
  UpdateSubscriberRequest,
  UpdateSubscriberResponse,
  BulkSubscriberRequest,
  BulkOperationResponse,
  SubscriberStats,
  ExportResponse,
  ExportParams,
} from "@/lib/types/subscribers.types";

export const useSubscribers = () => {
  const axios = useAxios();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Clear error state
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Subscribe a new email
  const subscribe = useCallback(
    async (data: SubscribeRequest): Promise<SubscribeResponse | null> => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.post<SubscribeResponse>(
          "/api/subscribers",
          data
        );
        return response.data;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to subscribe";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [axios]
  );

  // Unsubscribe an email
  const unsubscribe = useCallback(
    async (
      email?: string,
      id?: string
    ): Promise<UpdateSubscriberResponse | null> => {
      try {
        setLoading(true);
        setError(null);
        const params = new URLSearchParams();
        if (email) params.append("email", email);
        if (id) params.append("id", id);

        const response = await axios.delete<UpdateSubscriberResponse>(
          `/api/subscribers?${params.toString()}`
        );
        return response.data;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to unsubscribe";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [axios]
  );

  // Get subscribers (admin only)
  const getSubscribers = useCallback(
    async (
      params?: GetSubscribersParams
    ): Promise<GetSubscribersResponse | null> => {
      try {
        setLoading(true);
        setError(null);
        const queryParams = new URLSearchParams();

        if (params?.status) queryParams.append("status", params.status);
        if (params?.search) queryParams.append("search", params.search);
        if (params?.limit) queryParams.append("limit", params.limit.toString());
        if (params?.offset)
          queryParams.append("offset", params.offset.toString());

        const response = await axios.get<GetSubscribersResponse>(
          `/api/subscribers?${queryParams.toString()}`
        );
        return response.data;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to fetch subscribers";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [axios]
  );

  // Update subscriber (admin only)
  const updateSubscriber = useCallback(
    async (
      data: UpdateSubscriberRequest
    ): Promise<UpdateSubscriberResponse | null> => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.patch<UpdateSubscriberResponse>(
          "/api/subscribers",
          data
        );
        return response.data;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to update subscriber";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [axios]
  );

  // Bulk operations (admin only)
  const bulkOperation = useCallback(
    async (
      data: BulkSubscriberRequest
    ): Promise<BulkOperationResponse | null> => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.post<BulkOperationResponse>(
          "/api/subscribers/bulk",
          data
        );
        return response.data;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to perform bulk operation";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [axios]
  );

  // Get subscriber statistics (admin only)
  const getStats = useCallback(async (): Promise<SubscriberStats | null> => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get<SubscriberStats>(
        "/api/subscribers/stats"
      );
      return response.data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to fetch statistics";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [axios]);

  // Export subscribers (admin only)
  const exportSubscribers = useCallback(
    async (params?: ExportParams): Promise<ExportResponse | null> => {
      try {
        setLoading(true);
        setError(null);
        const queryParams = new URLSearchParams();

        if (params?.format) queryParams.append("format", params.format);
        if (params?.status) queryParams.append("status", params.status);
        if (params?.active_only)
          queryParams.append("active_only", params.active_only.toString());

        const response = await axios.get<ExportResponse>(
          `/api/subscribers/export?${queryParams.toString()}`
        );
        return response.data;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to export subscribers";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [axios]
  );

  // Download CSV export
  const downloadCSV = useCallback(
    async (params?: Omit<ExportParams, "format">): Promise<void> => {
      try {
        setLoading(true);
        setError(null);
        const queryParams = new URLSearchParams();
        queryParams.append("format", "csv");

        if (params?.status) queryParams.append("status", params.status);
        if (params?.active_only)
          queryParams.append("active_only", params.active_only.toString());

        // Use direct fetch for file download
        const token = localStorage.getItem("token");
        const response = await fetch(
          `/api/subscribers/export?${queryParams.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to download CSV");
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `subscribers_${
          new Date().toISOString().split("T")[0]
        }.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } catch (err: any) {
        const errorMessage = err.message || "Failed to download CSV";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    loading,
    error,
    clearError,
    subscribe,
    unsubscribe,
    getSubscribers,
    updateSubscriber,
    bulkOperation,
    getStats,
    exportSubscribers,
    downloadCSV,
  };
};
