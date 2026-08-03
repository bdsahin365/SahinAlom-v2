import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'avatar' | 'rectangular' | 'circular';
}

export default function Skeleton({ variant = 'rectangular', className, ...props }: SkeletonProps) {
  const variants = {
    text: 'h-4 w-full rounded',
    avatar: 'h-12 w-12 rounded-full',
    rectangular: 'h-32 w-full rounded-lg',
    circular: 'h-20 w-20 rounded-full',
  };

  return (
    <div
      className={cn('animate-pulse bg-secondary-200 dark:bg-secondary-800', variants[variant], className)}
      {...props}
    />
  );
}
