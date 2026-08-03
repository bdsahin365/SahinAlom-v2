import React from 'react';
import { cn } from '@/lib/utils';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helper?: string;
  maxLength?: number;
  showCharCount?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helper,
      maxLength,
      showCharCount = false,
      className,
      value,
      ...props
    },
    ref
  ) => {
    const charCount = typeof value === 'string' ? value.length : 0;

    return (
      <div className="w-full">
        {label && (
          <label className="block text-label-lg mb-2 text-foreground">
            {label}
            {props.required && <span className="text-error ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          maxLength={maxLength}
          value={value}
          className={cn(
            'input-base w-full resize-vertical min-h-[120px]',
            error && 'border-error focus:border-error focus:ring-error/20',
            className
          )}
          {...props}
        />
        <div className="flex items-center justify-between mt-2">
          <div>
            {error && <p className="text-error text-sm">{error}</p>}
            {helper && !error && <p className="text-secondary text-sm">{helper}</p>}
          </div>
          {showCharCount && maxLength && (
            <p className={cn('text-xs', charCount > maxLength * 0.8 ? 'text-warning' : 'text-secondary')}>
              {charCount}/{maxLength}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
