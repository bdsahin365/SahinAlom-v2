/**
 * Centralized error handling and logging.
 */

import React, { ReactNode } from 'react';

export interface ErrorInfo {
  componentStack: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface ErrorLog {
  error: Error;
  errorInfo?: ErrorInfo;
  context?: Record<string, any>;
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary component for catching React errors
 * Note: ErrorBoundary must be a class component
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  declare props: ErrorBoundaryProps;
  state: ErrorBoundaryState = { hasError: false, error: null };

  constructor(props: ErrorBoundaryProps) {
    super(props);
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    const info: ErrorInfo = {
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      severity: 'high',
    };

    logError({
      error,
      errorInfo: info,
    });
  }

  render(): ReactNode {
    const { children } = this.props;
    
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
          <div className="max-w-md w-full">
            <h2 className="text-2xl font-bold text-red-900 mb-4">Something went wrong</h2>
            <p className="text-red-700 mb-6">
              An unexpected error occurred. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
            >
              Reload Page
            </button>
            <details className="mt-4 p-3 bg-red-100 rounded text-sm">
              <summary className="cursor-pointer font-semibold text-red-900">
                Error Details
              </summary>
              <pre className="mt-2 text-red-800 overflow-auto text-xs">
                {this.state.error?.message}
              </pre>
            </details>
          </div>
        </div>
      );
    }

    return children;
  }
}

/**
 * Error logging utility
 */
export function logError(errorLog: ErrorLog): void {
  console.error('[v0] Error logged:', errorLog);

  // Could send to external service
  // Example: sendToSentry(errorLog);
}

/**
 * Custom application error class
 */
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

/**
 * Validation error
 */
export class ValidationError extends AppError {
  constructor(message: string, public fields?: Record<string, string>) {
    super(message, 'VALIDATION_ERROR', 400);
    this.name = 'ValidationError';
  }
}

/**
 * Network error
 */
export class NetworkError extends AppError {
  constructor(message: string) {
    super(message, 'NETWORK_ERROR', 0);
    this.name = 'NetworkError';
  }
}

/**
 * Authentication error
 */
export class AuthError extends AppError {
  constructor(message: string) {
    super(message, 'AUTH_ERROR', 401);
    this.name = 'AuthError';
  }
}

/**
 * Authorization error
 */
export class PermissionError extends AppError {
  constructor(message: string) {
    super(message, 'PERMISSION_ERROR', 403);
    this.name = 'PermissionError';
  }
}

/**
 * Not found error
 */
export class NotFoundError extends AppError {
  constructor(message: string, public resource?: string) {
    super(message, 'NOT_FOUND', 404);
    this.name = 'NotFoundError';
  }
}

/**
 * Conflict error
 */
export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 'CONFLICT', 409);
    this.name = 'ConflictError';
  }
}

/**
 * Rate limit error
 */
export class RateLimitError extends AppError {
  constructor(
    message: string,
    public retryAfter?: number
  ) {
    super(message, 'RATE_LIMIT', 429);
    this.name = 'RateLimitError';
  }
}

/**
 * Server error
 */
export class ServerError extends AppError {
  constructor(message: string) {
    super(message, 'SERVER_ERROR', 500);
    this.name = 'ServerError';
  }
}

/**
 * Create error from status code
 */
export function createErrorFromStatus(status: number, message: string): AppError {
  switch (status) {
    case 400:
      return new ValidationError(message);
    case 401:
      return new AuthError(message);
    case 403:
      return new PermissionError(message);
    case 404:
      return new NotFoundError(message);
    case 409:
      return new ConflictError(message);
    case 429:
      return new RateLimitError(message);
    case 500:
      return new ServerError(message);
    default:
      return new AppError(message, 'UNKNOWN_ERROR', status);
  }
}

/**
 * Safe error message extraction
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof AppError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected error occurred';
}

/**
 * Check if error is recoverable
 */
export function isRecoverableError(error: unknown): boolean {
  if (error instanceof RateLimitError || error instanceof NetworkError) {
    return true;
  }
  if (error instanceof AppError) {
    return error.statusCode && error.statusCode >= 500;
  }
  return true;
}

/**
 * Retry async operation with exponential backoff
 */
export async function retry<T>(
  operation: () => Promise<T>,
  maxAttempts = 3,
  baseDelayMs = 1000
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt < maxAttempts - 1 && isRecoverableError(error)) {
        const delay = baseDelayMs * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw lastError;
      }
    }
  }

  throw lastError;
}

/**
 * Assert condition
 */
export function assert(
  condition: boolean,
  message: string,
  details?: Record<string, any>
): asserts condition {
  if (!condition) {
    throw new AppError(message, 'ASSERTION_ERROR', 500, details);
  }
}

/**
 * Ensure value exists
 */
export function ensure<T>(value: T | null | undefined, message: string): T {
  if (!value) {
    throw new NotFoundError(message);
  }
  return value;
}

/**
 * Try to parse JSON safely
 */
export function safeJsonParse<T = any>(
  json: string,
  fallback: T | null = null
): T | null {
  try {
    return JSON.parse(json);
  } catch (error) {
    console.warn('[v0] Failed to parse JSON:', error);
    return fallback;
  }
}

/**
 * Try to stringify safely
 */
export function safeJsonStringify(value: any, fallback = '{}'): string {
  try {
    return JSON.stringify(value);
  } catch (error) {
    console.warn('[v0] Failed to stringify to JSON:', error);
    return fallback;
  }
}
