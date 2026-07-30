import { useState, useEffect, useCallback } from 'react';
import { adminDataService, Product, Order, Customer, DashboardStats } from '@/services/adminDataService';

interface UseDataState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  isRefetching: boolean;
}

/**
 * Hook for fetching dashboard data with loading and error states
 */
export function useDashboardStats(): UseDataState<DashboardStats> {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefetching, setIsRefetching] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    try {
      const result = await adminDataService.getStats();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    }
  }, []);

  const refetch = useCallback(async () => {
    setIsRefetching(true);
    try {
      await fetch();
    } finally {
      setIsRefetching(false);
    }
  }, [fetch]);

  useEffect(() => {
    setLoading(true);
    fetch().finally(() => setLoading(false));
  }, [fetch]);

  return { data, loading, error, refetch, isRefetching };
}

export function useProducts(): UseDataState<Product[]> {
  const [data, setData] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefetching, setIsRefetching] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    try {
      const result = await adminDataService.getProducts();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    }
  }, []);

  const refetch = useCallback(async () => {
    setIsRefetching(true);
    try {
      await fetch();
    } finally {
      setIsRefetching(false);
    }
  }, [fetch]);

  useEffect(() => {
    setLoading(true);
    fetch().finally(() => setLoading(false));
  }, [fetch]);

  return { data, loading, error, refetch, isRefetching };
}

export function useOrders(): UseDataState<Order[]> {
  const [data, setData] = useState<Order[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefetching, setIsRefetching] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    try {
      const result = await adminDataService.getOrders();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    }
  }, []);

  const refetch = useCallback(async () => {
    setIsRefetching(true);
    try {
      await fetch();
    } finally {
      setIsRefetching(false);
    }
  }, [fetch]);

  useEffect(() => {
    setLoading(true);
    fetch().finally(() => setLoading(false));
  }, [fetch]);

  return { data, loading, error, refetch, isRefetching };
}

export function useCustomers(): UseDataState<Customer[]> {
  const [data, setData] = useState<Customer[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefetching, setIsRefetching] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    try {
      const result = await adminDataService.getCustomers();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    }
  }, []);

  const refetch = useCallback(async () => {
    setIsRefetching(true);
    try {
      await fetch();
    } finally {
      setIsRefetching(false);
    }
  }, [fetch]);

  useEffect(() => {
    setLoading(true);
    fetch().finally(() => setLoading(false));
  }, [fetch]);

  return { data, loading, error, refetch, isRefetching };
}

/**
 * Generic hook for search operations
 */
export function useSearchData<T>(
  searchFn: (query: string) => Promise<T[]>,
  initialQuery: string = ''
) {
  const [query, setQuery] = useState(initialQuery);
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setData(null);
      return;
    }

    const search = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await searchFn(query);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    search();
  }, [query, searchFn]);

  return { query, setQuery, data, loading, error };
}
