/**
 * Standardized API wrapper with error handling and retry logic.
 */

import { API_CONFIG, ERROR_MESSAGES } from '../config/index';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
  success: boolean;
}

export class ApiError extends Error {
  constructor(
    public message: string,
    public status?: number,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Fetch with automatic error handling and retry logic
 */
export async function fetchWithErrorHandling<T = any>(
  url: string,
  options?: RequestInit,
  retries?: number
): Promise<ApiResponse<T>> {
  const maxRetries = retries ?? API_CONFIG.RETRY_ATTEMPTS;
  const reqOptions = options ?? {};
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      ...reqOptions,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new ApiError(
        handleApiErrorStatus(response.status),
        response.status
      );
    }

    const data = await response.json();
    return {
      data,
      status: response.status,
      success: true,
    };
  } catch (error) {
    clearTimeout(timeoutId);

    // Retry on network error
    if (maxRetries > 0 && shouldRetry(error)) {
      await new Promise(resolve =>
        setTimeout(resolve, API_CONFIG.RETRY_DELAY_MS)
      );
      return fetchWithErrorHandling<T>(url, reqOptions, maxRetries - 1);
    }

    const message = getErrorMessage(error);
    console.error('[v0] API Error:', { url, message, error });

    return {
      error: message,
      status: error instanceof ApiError ? error.status : 0,
      success: false,
    };
  }
}

/**
 * Handle specific HTTP error statuses
 */
function handleApiErrorStatus(status: number): string {
  switch (status) {
    case 400:
      return 'Invalid request. Please check your input.';
    case 401:
      return ERROR_MESSAGES.UNAUTHORIZED;
    case 403:
      return 'Access forbidden. You do not have permission.';
    case 404:
      return 'Resource not found.';
    case 409:
      return 'Conflict. The resource may have been modified.';
    case 429:
      return 'Too many requests. Please wait a moment and try again.';
    case 500:
      return ERROR_MESSAGES.SERVER_ERROR;
    case 502:
      return 'Bad gateway. Please try again later.';
    case 503:
      return 'Service unavailable. Please try again later.';
    default:
      return ERROR_MESSAGES.FETCH_ERROR;
  }
}

/**
 * Determine if error should trigger retry
 */
function shouldRetry(error: any): boolean {
  if (error instanceof ApiError) {
    const status = error.status;
    // Retry on network errors and server errors
    return !status || (status >= 500 && status < 600);
  }
  // Network errors (TypeError, AbortError)
  return true;
}

/**
 * Extract user-friendly error message
 */
function getErrorMessage(error: any): string {
  if (error instanceof ApiError) {
    return error.message;
  }
  if (error instanceof TypeError) {
    return ERROR_MESSAGES.NETWORK_ERROR;
  }
  if (error?.name === 'AbortError') {
    return 'Request timed out. Please try again.';
  }
  return ERROR_MESSAGES.FETCH_ERROR;
}

/**
 * Helper to fetch multiple endpoints in parallel
 */
export async function fetchMultiple<T extends Record<string, any>>(
  endpoints: Record<keyof T, string>
): Promise<{
  data: Partial<T>;
  errors: Record<string, string>;
  allSuccess: boolean;
}> {
  const results = await Promise.allSettled(
    Object.entries(endpoints).map(([key, url]) =>
      fetchWithErrorHandling(url).then(result => ({
        key,
        result,
      }))
    )
  );

  const data: Partial<T> = {};
  const errors: Record<string, string> = {};
  let allSuccess = true;

  results.forEach(result => {
    if (result.status === 'fulfilled') {
      const { key, result: apiResult } = result.value;
      if (apiResult.success) {
        (data as any)[key] = apiResult.data;
      } else {
        errors[key] = apiResult.error || ERROR_MESSAGES.FETCH_ERROR;
        allSuccess = false;
      }
    } else {
      errors[Object.keys(endpoints)[0]] = ERROR_MESSAGES.NETWORK_ERROR;
      allSuccess = false;
    }
  });

  return { data, errors, allSuccess };
}

/**
 * Create a delay for testing/retries
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
