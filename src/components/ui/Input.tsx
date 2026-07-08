'use client';

import {
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
  type SelectHTMLAttributes,
  forwardRef,
  useState,
} from 'react';

/* ── Base input field ── */

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-text-primary/80"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={[
            'w-full rounded-lg border bg-bg-accent px-4 py-2.5 text-sm text-text-primary',
            'placeholder:text-text-primary/40',
            'border-bg-accent focus:border-gold-mid focus:outline-none focus:ring-1 focus:ring-gold-mid/40',
            'transition-colors duration-200',
            error && 'border-red-accent focus:border-red-accent focus:ring-red-accent/40',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          {...props}
        />
        {error && <p className="text-xs text-red-accent">{error}</p>}
      </div>
    );
  },
);

InputField.displayName = 'InputField';

/* ── Textarea ── */

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-text-primary/80"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={[
            'w-full rounded-lg border bg-bg-accent px-4 py-2.5 text-sm text-text-primary',
            'placeholder:text-text-primary/40',
            'border-bg-accent focus:border-gold-mid focus:outline-none focus:ring-1 focus:ring-gold-mid/40',
            'transition-colors duration-200 resize-y min-h-[80px]',
            error && 'border-red-accent focus:border-red-accent focus:ring-red-accent/40',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          {...props}
        />
        {error && <p className="text-xs text-red-accent">{error}</p>}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';

/* ── Select ── */

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className = '', id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-text-primary/80"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={inputId}
          className={[
            'w-full rounded-lg border bg-bg-accent px-4 py-2.5 text-sm text-text-primary',
            'border-bg-accent focus:border-gold-mid focus:outline-none focus:ring-1 focus:ring-gold-mid/40',
            'transition-colors duration-200 appearance-none',
            'bg-[url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEgMUw2IDZMMTEgMSIgc3Ryb2tlPSIjZDVhNTM2IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==")] bg-[length:12px_8px] bg-[right_12px_center] bg-no-repeat pr-8',
            error && 'border-red-accent focus:border-red-accent focus:ring-red-accent/40',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-red-accent">{error}</p>}
      </div>
    );
  },
);

Select.displayName = 'Select';

/* ── Search input ── */

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-text-primary/80"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {/* Magnifying glass icon */}
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-primary/40 pointer-events-none">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </span>
          <input
            ref={ref}
            id={inputId}
            className={[
              'w-full rounded-lg border bg-bg-accent py-2.5 pl-10 pr-4 text-sm text-text-primary',
              'placeholder:text-text-primary/40',
              'border-bg-accent focus:border-gold-mid focus:outline-none focus:ring-1 focus:ring-gold-mid/40',
              'transition-colors duration-200',
              error && 'border-red-accent focus:border-red-accent focus:ring-red-accent/40',
              className,
            ]
              .filter(Boolean)
              .join(' ')}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-red-accent">{error}</p>}
      </div>
    );
  },
);

SearchInput.displayName = 'SearchInput';

export { InputField, Textarea, Select, SearchInput };
export type { InputFieldProps, TextareaProps, SelectProps, SearchInputProps };
