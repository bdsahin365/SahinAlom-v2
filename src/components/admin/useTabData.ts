import { useState, useEffect, useCallback } from 'react';

interface UseTabDataState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  retry: () => void;
}

/**
 * Hook for managing async data loading, error states, and retries
 * Used by all tab components for consistent data fetching
 */
export function useTabData<T>(
  fetchFn: () => Promise<T>,
  dependencies: any[] = []
): UseTabDataState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [fetchFn]);

  useEffect(() => {
    fetch();
  }, dependencies);

  return {
    data,
    loading,
    error,
    retry: fetch,
  };
}

/**
 * Simulated data fetching with configurable delay and error
 * Use for demo/development purposes
 */
export async function simulateDataFetch<T>(
  data: T,
  delayMs: number = 500,
  shouldError: boolean = false
): Promise<T> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldError) {
        reject(new Error('Simulated data fetch error'));
      } else {
        resolve(data);
      }
    }, delayMs);
  });
}
