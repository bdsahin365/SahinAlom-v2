/**
 * Reusable Card component for content containers
 */

import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'sm' | 'md' | 'lg';
  hover?: boolean;
  interactive?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      padding = 'md',
      hover = false,
      interactive = false,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const getVariantClasses = () => {
      switch (variant) {
        case 'elevated':
          return 'bg-white dark:bg-gray-800 shadow-lg';
        case 'outlined':
          return 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700';
        case 'default':
        default:
          return 'bg-white dark:bg-gray-800 shadow';
      }
    };

    const getPaddingClasses = () => {
      switch (padding) {
        case 'sm':
          return 'p-3';
        case 'lg':
          return 'p-6';
        case 'md':
        default:
          return 'p-4';
      }
    };

    const combinedClassName = `
      rounded-lg
      ${getVariantClasses()}
      ${getPaddingClasses()}
      ${hover ? 'hover:shadow-lg transition-shadow duration-200' : ''}
      ${interactive ? 'cursor-pointer active:scale-98 transition-transform' : ''}
      ${className}
    `.trim();

    return (
      <div ref={ref} className={combinedClassName} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

/**
 * Card Header component
 */
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ title, subtitle, action, className = '', children, ...props }, ref) => {
    return (
      <div ref={ref} className={`border-b border-gray-200 dark:border-gray-700 pb-4 mb-4 ${className}`.trim()} {...props}>
        {children || (
          <div className="flex items-start justify-between gap-4">
            <div>
              {title && <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>}
              {subtitle && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{subtitle}</p>}
            </div>
            {action && <div className="flex-shrink-0">{action}</div>}
          </div>
        )}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

/**
 * Card Body component
 */
export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardBody = React.forwardRef<HTMLDivElement, CardBodyProps>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <div ref={ref} className={`${className}`.trim()} {...props}>
        {children}
      </div>
    );
  }
);

CardBody.displayName = 'CardBody';

/**
 * Card Footer component
 */
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`border-t border-gray-200 dark:border-gray-700 pt-4 mt-4 flex gap-2 justify-end ${className}`.trim()}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardFooter.displayName = 'CardFooter';
