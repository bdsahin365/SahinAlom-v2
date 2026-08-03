import React from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'section';
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ size = 'lg', variant = 'default', className, children, ...props }, ref) => {
    const sizes = {
      sm: 'max-w-2xl',
      md: 'max-w-4xl',
      lg: 'max-w-7xl',
      xl: 'max-w-full',
    };

    const variants = {
      default: '',
      section: 'py-20',
    };

    return (
      <div
        ref={ref}
        className={cn('mx-auto px-4 sm:px-6 lg:px-8', sizes[size], variants[variant], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Container.displayName = 'Container';

export default Container;
