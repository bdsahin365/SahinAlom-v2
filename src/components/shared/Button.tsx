/**
 * Reusable Button component with multiple variants
 */

import React from 'react';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      icon,
      iconPosition = 'left',
      disabled,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    const getVariantClasses = () => {
      const baseClasses = 'font-semibold transition-colors duration-200 rounded';
      switch (variant) {
        case 'primary':
          return `${baseClasses} bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white disabled:bg-blue-400`;
        case 'secondary':
          return `${baseClasses} bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white disabled:opacity-50`;
        case 'danger':
          return `${baseClasses} bg-red-600 hover:bg-red-700 active:bg-red-800 text-white disabled:bg-red-400`;
        case 'ghost':
          return `${baseClasses} bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600`;
        default:
          return baseClasses;
      }
    };

    const getSizeClasses = () => {
      switch (size) {
        case 'sm':
          return 'px-3 py-1 text-sm';
        case 'lg':
          return 'px-6 py-3 text-lg';
        case 'md':
        default:
          return 'px-4 py-2 text-base';
      }
    };

    const combinedClassName = `
      ${getVariantClasses()}
      ${getSizeClasses()}
      ${fullWidth ? 'w-full' : ''}
      ${disabled || loading ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
      ${className}
      inline-flex items-center justify-center gap-2
    `.trim();

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={combinedClassName}
        {...props}
      >
        {loading && iconPosition === 'left' && (
          <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
        )}
        {!loading && icon && iconPosition === 'left' && (
          <span className="inline-flex">{icon}</span>
        )}
        {children && <span>{children}</span>}
        {loading && iconPosition === 'right' && (
          <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
        )}
        {!loading && icon && iconPosition === 'right' && (
          <span className="inline-flex">{icon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
