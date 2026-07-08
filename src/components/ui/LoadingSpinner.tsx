'use client';

interface LoadingSpinnerProps {
  variant?: 'small' | 'medium' | 'full-page';
  className?: string;
}

const sizeMap: Record<NonNullable<LoadingSpinnerProps['variant']>, string> = {
  small: 'h-5 w-5 border-2',
  medium: 'h-10 w-10 border-3',
  'full-page': 'h-14 w-14 border-4',
};

const wrapperMap: Record<NonNullable<LoadingSpinnerProps['variant']>, string> = {
  small: 'inline-flex',
  medium: 'flex items-center justify-center py-12',
  'full-page': 'fixed inset-0 flex items-center justify-center bg-bg-deep/70 z-50',
};

export default function LoadingSpinner({
  variant = 'medium',
  className = '',
}: LoadingSpinnerProps) {
  return (
    <div className={[wrapperMap[variant], className].filter(Boolean).join(' ')}>
      <span
        className={[
          'inline-block rounded-full border-gold/30 border-t-gold border-r-gold',
          'animate-spin',
          sizeMap[variant],
        ].join(' ')}
        aria-label="Loading"
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </span>
    </div>
  );
}
