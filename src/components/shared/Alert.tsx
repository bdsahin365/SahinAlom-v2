/**
 * Reusable Alert and Loading components
 */

import React from 'react';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  type: AlertType;
  title?: string;
  message: string;
  onClose?: () => void;
  closeable?: boolean;
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      type,
      title,
      message,
      onClose,
      closeable = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const getTypeStyles = () => {
      switch (type) {
        case 'success':
          return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
        case 'error':
          return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
        case 'warning':
          return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
        case 'info':
          return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
        default:
          return '';
      }
    };

    const getTitleColor = () => {
      switch (type) {
        case 'success':
          return 'text-green-900 dark:text-green-100';
        case 'error':
          return 'text-red-900 dark:text-red-100';
        case 'warning':
          return 'text-yellow-900 dark:text-yellow-100';
        case 'info':
          return 'text-blue-900 dark:text-blue-100';
        default:
          return '';
      }
    };

    const getMessageColor = () => {
      switch (type) {
        case 'success':
          return 'text-green-800 dark:text-green-200';
        case 'error':
          return 'text-red-800 dark:text-red-200';
        case 'warning':
          return 'text-yellow-800 dark:text-yellow-200';
        case 'info':
          return 'text-blue-800 dark:text-blue-200';
        default:
          return '';
      }
    };

    return (
      <div
        ref={ref}
        className={`
          border-l-4 rounded-r
          p-4
          ${getTypeStyles()}
          ${className}
        `.trim()}
        role="alert"
        {...props}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            {title && <h4 className={`font-semibold mb-1 ${getTitleColor()}`}>{title}</h4>}
            <p className={`text-sm ${getMessageColor()}`}>{message}</p>
          </div>
          {closeable && (
            <button
              onClick={onClose}
              className="flex-shrink-0 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              aria-label="Close alert"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    );
  }
);

Alert.displayName = 'Alert';

/**
 * Loading Spinner component
 */
export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ size = 'md', text, className = '', ...props }, ref) => {
    const getSizeClasses = () => {
      switch (size) {
        case 'sm':
          return 'w-4 h-4';
        case 'lg':
          return 'w-12 h-12';
        case 'md':
        default:
          return 'w-8 h-8';
      }
    };

    return (
      <div
        ref={ref}
        className={`flex flex-col items-center justify-center gap-2 ${className}`.trim()}
        {...props}
      >
        <div
          className={`
            animate-spin
            ${getSizeClasses()}
            border-4
            border-gray-200 dark:border-gray-700
            border-t-blue-600 dark:border-t-blue-400
            rounded-full
          `.trim()}
          role="status"
          aria-label="Loading"
        />
        {text && <p className="text-gray-600 dark:text-gray-400 text-sm">{text}</p>}
      </div>
    );
  }
);

Spinner.displayName = 'Spinner';

/**
 * Skeleton Loader component
 */
export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
  rounded?: boolean;
  count?: number;
}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  (
    {
      width = '100%',
      height = '1rem',
      rounded = false,
      count = 1,
      className = '',
      ...props
    },
    ref
  ) => {
    const style: React.CSSProperties = {
      width: typeof width === 'number' ? `${width}px` : width,
      height: typeof height === 'number' ? `${height}px` : height,
    };

    const baseClasses = `
      bg-gray-200 dark:bg-gray-700
      animate-pulse
      ${rounded ? 'rounded-full' : 'rounded'}
      ${className}
    `.trim();

    return (
      <div ref={ref} {...props}>
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className={`${baseClasses} ${i > 0 ? 'mt-2' : ''}`}
            style={style}
          />
        ))}
      </div>
    );
  }
);

Skeleton.displayName = 'Skeleton';

/**
 * Empty State component
 */
export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    {
      icon,
      title,
      description,
      action,
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`
          flex flex-col items-center justify-center
          py-12 px-4
          text-center
          ${className}
        `.trim()}
        {...props}
      >
        {icon && (
          <div className="mb-4 text-gray-400 dark:text-gray-600 w-16 h-16 flex items-center justify-center">
            {icon}
          </div>
        )}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {title}
        </h3>
        {description && (
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm">
            {description}
          </p>
        )}
        {action && <div className="mt-4">{action}</div>}
      </div>
    );
  }
);

EmptyState.displayName = 'EmptyState';

/**
 * Loading Bar component
 */
export interface LoadingBarProps extends React.HTMLAttributes<HTMLDivElement> {
  progress?: number; // 0-100
}

export const LoadingBar = React.forwardRef<HTMLDivElement, LoadingBarProps>(
  ({ progress = 0, className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${className}`.trim()}
        {...props}
      >
        <div
          className="h-full bg-blue-600 dark:bg-blue-400 transition-all duration-300"
          style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
        />
      </div>
    );
  }
);

LoadingBar.displayName = 'LoadingBar';
