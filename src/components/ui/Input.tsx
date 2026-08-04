import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helper,
      icon,
      iconPosition = 'left',
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-label-lg mb-2 text-foreground">
            {label}
            {props.required && <span className="text-error ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {icon && iconPosition === 'left' && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-secondary pointer-events-none">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'input-base w-full',
              icon && iconPosition === 'left' ? 'pl-10' : undefined,
              icon && iconPosition === 'right' ? 'pr-10' : undefined,
              error && 'border-error focus:border-error focus:ring-error/20',
              className
            )}
            {...props}
          />
          {icon && iconPosition === 'right' && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-secondary pointer-events-none">
              {icon}
            </div>
          )}
        </div>
        {error && <p className="text-error text-sm mt-1">{error}</p>}
        {helper && !error && <p className="text-secondary text-sm mt-1">{helper}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
