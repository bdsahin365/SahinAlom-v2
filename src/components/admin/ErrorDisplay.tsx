import React from 'react';
import { Button } from '../shared';

interface ErrorDisplayProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  showDetails?: boolean;
  details?: string;
}

export function ErrorDisplay({
  title = 'Something went wrong',
  message,
  onRetry,
  showDetails = false,
  details,
}: ErrorDisplayProps) {
  return (
    <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-lg p-6">
      <div className="flex items-start gap-4">
        <div className="text-3xl flex-shrink-0">⚠️</div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-red-900 dark:text-red-200 mb-2">
            {title}
          </h3>
          <p className="text-red-800 dark:text-red-300 mb-4">{message}</p>
          
          {showDetails && details && (
            <details className="mb-4">
              <summary className="cursor-pointer text-sm text-red-700 dark:text-red-400 hover:text-red-900 dark:hover:text-red-200">
                Technical Details
              </summary>
              <pre className="mt-2 p-3 bg-red-100 dark:bg-red-950/40 rounded text-xs text-red-800 dark:text-red-300 overflow-auto max-h-40 font-mono">
                {details}
              </pre>
            </details>
          )}

          {onRetry && (
            <Button onClick={onRetry} variant="secondary" size="sm">
              Try Again
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export function EmptyStateDisplay({
  icon = '📭',
  title = 'No data available',
  message = 'There is nothing to display here.',
  actionLabel,
  onAction,
}: {
  icon?: string;
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-slate-200 mb-2">{title}</h3>
      <p className="text-slate-400 text-center max-w-md mb-6">{message}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export function DataFetchError({
  error,
  onRetry,
}: {
  error: Error | string;
  onRetry?: () => void;
}) {
  const message = typeof error === 'string' ? error : error.message || 'Failed to load data';
  
  return (
    <ErrorDisplay
      title="Failed to Load Data"
      message={message}
      onRetry={onRetry}
      showDetails={typeof error !== 'string'}
      details={typeof error !== 'string' ? error.stack : undefined}
    />
  );
}
