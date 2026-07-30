/**
 * Async state management hook with error handling and loading states
 * Handles data fetching, error management, and retry logic
 */

import { useEffect, useReducer, useCallback } from 'react';
import { fetchWithErrorHandling } from './api';

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  isRetrying: boolean;
  retryCount: number;
}

type AsyncAction<T> =
  | { type: 'PENDING' }
  | { type: 'SUCCESS'; payload: T }
  | { type: 'ERROR'; payload: Error }
  | { type: 'RETRY' }
  | { type: 'RESET' };

const initialState = <T,>(): AsyncState<T> => ({
  data: null,
  loading: false,
  error: null,
  isRetrying: false,
  retryCount: 0,
});

function asyncReducer<T>(
  state: AsyncState<T>,
  action: AsyncAction<T>
): AsyncState<T> {
  switch (action.type) {
    case 'PENDING':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'SUCCESS':
      return {
        ...state,
        data: action.payload,
        loading: false,
        error: null,
        isRetrying: false,
      };
    case 'ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false,
        isRetrying: false,
      };
    case 'RETRY':
      return {
        ...state,
        isRetrying: true,
        retryCount: state.retryCount + 1,
      };
    case 'RESET':
      return initialState<T>();
    default:
      return state;
  }
}

export interface UseAsyncOptions {
  immediate?: boolean;
  retryCount?: number;
  retryDelay?: number;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  deps?: any[];
}

/**
 * Hook for async operations with automatic error handling
 */
export function useAsync<T = any>(
  asyncFn: () => Promise<T>,
  options: UseAsyncOptions = {}
) {
  const {
    immediate = true,
    retryCount = 3,
    retryDelay = 1000,
    onSuccess,
    onError,
    deps = [],
  } = options;

  const [state, dispatch] = useReducer(asyncReducer, initialState<T>());

  const execute = useCallback(
    async (retries = 0) => {
      dispatch({ type: 'PENDING' });

      try {
        const response = await asyncFn();
        dispatch({ type: 'SUCCESS', payload: response });
        onSuccess?.(response);
        return response;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));

        if (retries < retryCount) {
          dispatch({ type: 'RETRY' });
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
          return execute(retries + 1);
        }

        dispatch({ type: 'ERROR', payload: error });
        onError?.(error);
        throw error;
      }
    },
    [asyncFn, retryCount, retryDelay, onSuccess, onError]
  );

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute, ...deps]);

  return {
    ...state,
    execute,
    reset,
    isLoading: state.loading || state.isRetrying,
  };
}

/**
 * Hook specifically for API fetching with type safety
 */
export function useAsyncAPI<T = any>(
  url: string,
  options?: Omit<UseAsyncOptions, 'asyncFn'> & { method?: string; body?: any }
) {
  const { method = 'GET', body, ...asyncOptions } = options || {};

  return useAsync<T>(
    () =>
      fetchWithErrorHandling<T>(url, {
        method,
        body: body ? JSON.stringify(body) : undefined,
      }).then((res) => {
        if (!res.success) {
          throw new Error(res.error || 'Request failed');
        }
        return res.data as T;
      }),
    asyncOptions
  );
}

/**
 * Hook for submitting forms with error handling
 */
export function useAsyncSubmit<T = any>(
  submitFn: (data: any) => Promise<T>,
  options: UseAsyncOptions = {}
) {
  const { immediate = false, ...asyncOptions } = options;

  return useAsync(submitFn, {
    immediate,
    ...asyncOptions,
  });
}
