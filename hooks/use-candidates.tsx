import { useState, useEffect, useCallback } from "react";
import { config } from "@/config";
import { NewCandidateData } from "@/app/api/candidate/new/route";
import { TopCandidate } from "@/app/api/candidate/top/route";

export function useTopCandidates(limit?: number) {
  const [candidates, setCandidates] = useState<TopCandidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTopCandidates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${config.clientUrl}/api/candidate/top`);

      if (!response.ok) {
        throw new Error("Failed to fetch top candidates");
      }

      const data: TopCandidate[] = await response.json();
      const limitedData = limit ? data.slice(0, limit) : data;
      setCandidates(limitedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchTopCandidates();
  }, [fetchTopCandidates]);

  return { candidates, loading, error, refetch: fetchTopCandidates };
}

export function useNewCandidates(limit?: number) {
  const [candidates, setCandidates] = useState<NewCandidateData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNewCandidates() {
      try {
        setLoading(true);
        const response = await fetch(`${config.clientUrl}/api/candidate/new`);

        if (!response.ok) {
          throw new Error("Failed to fetch new candidates");
        }

        const data: NewCandidateData[] = await response.json();
        const limitedData = limit ? data.slice(0, limit) : data;
        setCandidates(limitedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchNewCandidates();
  }, [limit]);

  return { candidates, loading, error, refetch: () => setLoading(true) };
}
