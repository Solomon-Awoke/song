'use client';

import { type HTMLAttributes, forwardRef } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'interactive' | 'song-card';
}

const variantStyles: Record<NonNullable<CardProps['variant']>, string> = {
  default:
    'bg-bg-mid border-l-2 border-gold rounded-lg shadow-lg shadow-black/20',
  interactive:
    'bg-bg-mid border-l-2 border-gold rounded-lg shadow-lg shadow-black/20 cursor-pointer transition-all duration-200 ease-in-out hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30 hover:border-gold-light',
  'song-card':
    'bg-bg-mid border-l-2 border-gold rounded-lg shadow-lg shadow-black/20 cursor-pointer transition-all duration-200 ease-in-out hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30 hover:border-gold-light',
};

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', className = '', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={[
          'p-5',
          variantStyles[variant],
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = 'Card';

export { Card, type CardProps };
