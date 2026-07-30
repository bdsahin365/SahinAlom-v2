import React, { ReactNode } from 'react';
import { Spinner, Skeleton, EmptyState } from './Alert';
import { Alert } from './Alert';

interface AsyncBoundaryProps {
  isLoading?: boolean;
  error?: Error | null;
  data?: any;
  isEmpty?: boolean;
  children: ReactNode;
  fallback?: ReactNode;
  skeleton?: ReactNode;
  emptyMessage?: string;
  errorMessage?: string;
  onRetry?: () => void;
}

/**
 * Component that wraps async content with loading, error, and empty states
 * Automatically handles error boundaries and loading spinners
 */
export function AsyncBoundary({
  isLoading = false,
  error = null,
  data = null,
  isEmpty = false,
  children,
  fallback = <Spinner size="lg" />,
  skeleton,
  emptyMessage = 'No data available',
  errorMessage,
  onRetry,
}: AsyncBoundaryProps) {
  if (isLoading) {
    return <div className="animate-pulse">{skeleton || fallback}</div>;
  }

  if (error) {
    return (
      <Alert variant="error">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-semibold mb-1">Error loading content</p>
            <p className="text-sm opacity-90">
              {errorMessage || error.message || 'An unexpected error occurred'}
            </p>
          </div>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-medium flex-shrink-0"
            >
              Retry
            </button>
          )}
        </div>
      </Alert>
    );
  }

  if (isEmpty || !data) {
    return <EmptyState message={emptyMessage} />;
  }

  return <>{children}</>;
}

/**
 * HOC to wrap a component with AsyncBoundary
 */
export function withAsyncBoundary<P extends object>(
  Component: React.ComponentType<P>,
  defaultProps: Partial<AsyncBoundaryProps> = {}
) {
  return function WrappedComponent(
    props: P & Partial<AsyncBoundaryProps>
  ) {
    const {
      isLoading,
      error,
      data,
      isEmpty,
      fallback,
      skeleton,
      emptyMessage,
      errorMessage,
      onRetry,
      ...componentProps
    } = props;

    return (
      <AsyncBoundary
        isLoading={isLoading}
        error={error}
        data={data}
        isEmpty={isEmpty}
        fallback={fallback}
        skeleton={skeleton}
        emptyMessage={emptyMessage}
        errorMessage={errorMessage}
        onRetry={onRetry}
        {...defaultProps}
      >
        <Component {...(componentProps as P)} />
      </AsyncBoundary>
    );
  };
}

/**
 * Component for showing loading progress
 */
export interface LoadingStateProps {
  message?: string;
  progress?: number;
  subMessage?: string;
}

export function LoadingState({
  message = 'Loading...',
  progress,
  subMessage,
}: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <Spinner size="lg" />
      <div className="text-center">
        <p className="font-medium text-gray-900 dark:text-white">{message}</p>
        {subMessage && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {subMessage}
          </p>
        )}
      </div>
      {progress !== undefined && (
        <div className="w-full max-w-xs bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      )}
    </div>
  );
}

/**
 * Component for showing error with retry option
 */
export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  details?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
  details,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md w-full">
        <h3 className="font-semibold text-red-900 dark:text-red-200 mb-2">
          {title}
        </h3>
        <p className="text-sm text-red-800 dark:text-red-300 mb-4">{message}</p>
        {details && (
          <details className="mb-4">
            <summary className="cursor-pointer text-xs text-red-700 dark:text-red-400 font-medium">
              Show details
            </summary>
            <pre className="mt-2 text-xs bg-red-100 dark:bg-red-900/30 p-2 rounded overflow-auto max-h-48">
              {details}
            </pre>
          </details>
        )}
        {onRetry && (
          <button
            onClick={onRetry}
            className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-medium text-sm"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
