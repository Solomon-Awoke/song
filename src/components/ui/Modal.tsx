'use client';

import { type ReactNode, useEffect, useCallback, useState } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}

export default function Modal({
  open,
  onClose,
  title,
  children,
  className = '',
}: ModalProps) {
  const [visible, setVisible] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (open) {
      setVisible(true);
      // Trigger enter animation on next frame
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAnimate(true);
        });
      });
    } else {
      setAnimate(false);
      const timer = setTimeout(() => setVisible(false), 200);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, handleKeyDown]);

  if (!visible) return null;

  return (
    <div
      className={[
        'fixed inset-0 z-50 flex items-center justify-center p-4',
        'transition-opacity duration-200 ease-out',
        animate ? 'opacity-100' : 'opacity-0',
      ].join(' ')}
    >
      {/* Overlay */}
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-default"
        onClick={onClose}
        aria-label="Close modal"
      />

      {/* Modal panel */}
      <div
        className={[
          'relative z-10 w-full max-w-lg rounded-xl bg-bg-mid border border-gold/20 shadow-2xl shadow-black/40',
          'transition-all duration-200 ease-out',
          animate ? 'scale-100 opacity-100' : 'scale-95 opacity-0',
          className,
        ].join(' ')}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        {/* Header */}
        {(title || true) && (
          <div className="flex items-center justify-between border-b border-gold/10 px-6 py-4">
            {title ? (
              <h2 className="text-lg font-semibold text-text-primary">
                {title}
              </h2>
            ) : (
              <span />
            )}
            <button
              type="button"
              onClick={onClose}
              className={[
                'flex items-center justify-center rounded-full p-1.5',
                'text-text-primary/50 hover:text-gold hover:bg-gold/10',
                'transition-colors duration-150',
              ].join(' ')}
              aria-label="Close"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        )}

        {/* Content */}
        <div className="px-6 py-4">{children}</div>
      </div>
    </div>
  );
}
