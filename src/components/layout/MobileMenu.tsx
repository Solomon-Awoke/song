'use client';

import { type ReactNode, useEffect, useCallback, useState } from 'react';

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function MobileMenu({ open, onClose, children }: MobileMenuProps) {
  const [visible, setVisible] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (open) {
      setVisible(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAnimate(true);
        });
      });
    } else {
      setAnimate(false);
      const timer = setTimeout(() => setVisible(false), 250);
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
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, handleKeyDown]);

  if (!visible) return null;

  return (
    <>
      {/* Overlay */}
      <button
        type="button"
        className={[
          'fixed inset-0 z-40 bg-black/50',
          'transition-opacity duration-250 ease-out',
          animate ? 'opacity-100' : 'opacity-0',
        ].join(' ')}
        onClick={onClose}
        aria-label="Close menu"
      />

      {/* Slide-in panel */}
      <aside
        className={[
          'fixed left-0 top-0 z-50 h-full w-72 bg-bg-mid border-r border-gold/20 shadow-2xl',
          'transition-transform duration-250 ease-out',
          animate ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        {/* Close button */}
        <div className="flex items-center justify-end border-b border-gold/10 px-4 py-3">
          <button
            type="button"
            onClick={onClose}
            className={[
              'flex items-center justify-center rounded-full p-2',
              'text-text-primary/50 hover:text-gold hover:bg-gold/10',
              'transition-colors duration-150',
            ].join(' ')}
            aria-label="Close menu"
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

        {/* Menu content */}
        <nav className="flex flex-col px-4 py-4">{children}</nav>
      </aside>
    </>
  );
}
