import { useState, useEffect, useCallback } from "react";
import { getAnalyticsSummary } from "@/services/analytics.service";

const useAnalytics = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await getAnalyticsSummary();
      setData(result);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load analytics");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, isLoading, error, refresh: fetch };
};

export default useAnalytics;