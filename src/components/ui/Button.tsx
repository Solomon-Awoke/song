'use client';

import { type ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const variantStyles: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:
    'bg-gold text-bg-deep border-gold hover:bg-gold-mid hover:border-gold-mid active:bg-gold-mid',
  secondary:
    'bg-transparent text-gold border-gold/50 hover:bg-gold/10 hover:border-gold active:bg-gold/15',
  danger:
    'bg-transparent text-red-accent border-red-accent/50 hover:bg-red-accent/10 hover:border-red-accent active:bg-red-accent/15',
  ghost:
    'bg-transparent text-text-primary/70 border-transparent hover:text-gold hover:bg-gold/5 active:text-gold-mid',
};

const sizeStyles: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-5 py-2.5 text-sm gap-2',
  lg: 'px-7 py-3.5 text-base gap-2.5',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled,
      className = '',
      children,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={[
          'inline-flex items-center justify-center rounded-lg border font-medium',
          'transition-all duration-200 ease-in-out',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold',
          'disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none',
          'select-none cursor-pointer',
          variantStyles[variant],
          sizeStyles[size],
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      >
        {loading && (
          <span
            className={[
              'inline-block h-4 w-4 rounded-full border-2 border-current',
              'border-r-transparent animate-spin',
            ].join(' ')}
            aria-hidden="true"
          />
        )}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';

export { Button, type ButtonProps };
