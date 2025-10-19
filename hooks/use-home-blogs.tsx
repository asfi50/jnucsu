import { useState, useEffect, useCallback } from "react";
import { config } from "@/config";

interface BlogAuthor {
  id: string;
  name: string;
  avatar: string | null;
}

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  thumbnail: string | null;
  author: BlogAuthor;
  category: string;
  tags: string[];
  publishedAt: string;
  views: number;
  likes: number;
  loves: number;
  totalReactions: number;
  trendingScore?: number;
}

export function useRecentBlogs(limit?: number) {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecentBlogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const url = new URL(`${config.clientUrl}/api/blog/recent`);
      if (limit) {
        url.searchParams.set("limit", limit.toString());
      }

      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error("Failed to fetch recent blogs");
      }

      const data: BlogPost[] = await response.json();
      setBlogs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchRecentBlogs();
  }, [fetchRecentBlogs]);

  return { blogs, loading, error, refetch: fetchRecentBlogs };
}

export function useTrendingBlogs(limit?: number) {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrendingBlogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const url = new URL(`${config.clientUrl}/api/blog/trending`);
      if (limit) {
        url.searchParams.set("limit", limit.toString());
      }

      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error("Failed to fetch trending blogs");
      }

      const data: BlogPost[] = await response.json();
      setBlogs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchTrendingBlogs();
  }, [fetchTrendingBlogs]);

  return { blogs, loading, error, refetch: fetchTrendingBlogs };
}
