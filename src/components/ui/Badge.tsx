import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md';
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'primary', size = 'md', className, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-full whitespace-nowrap';

    const variants = {
      primary: 'bg-primary/10 text-primary dark:bg-primary/20',
      secondary: 'bg-secondary-100 text-secondary-900 dark:bg-secondary-800 dark:text-secondary-100',
      accent: 'bg-accent/10 text-accent dark:bg-accent/20',
      success: 'bg-success/10 text-success dark:bg-success/20',
      warning: 'bg-warning/10 text-warning dark:bg-warning/20',
      error: 'bg-error/10 text-error dark:bg-error/20',
    };

    const sizes = {
      sm: 'text-xs px-2.5 py-1',
      md: 'text-sm px-3 py-1.5',
    };

    return (
      <span
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;
