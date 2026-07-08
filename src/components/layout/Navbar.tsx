'use client';

import { useState } from 'react';
import MobileMenu from './MobileMenu';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Browse', href: '/browse' },
    { label: 'Search', href: '/search' },
  ];

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-gold/20 bg-bg-mid/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className={[
              'flex items-center justify-center rounded-lg p-2 sm:hidden',
              'text-text-primary/60 hover:text-gold hover:bg-gold/10',
              'transition-colors duration-150',
            ].join(' ')}
            aria-label="Open menu"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          {/* Logo / Title */}
          <a
            href="/"
            className="flex items-center gap-2 text-sm font-semibold tracking-wide text-gold sm:text-base"
          >
            <span className="text-gold-light ethiopian-cross" aria-hidden="true" />
            <span className="hidden sm:inline">የኢትዮጵያ ኦርቶዶክስ መዝሙራት</span>
            <span className="sm:hidden">መዝሙራት</span>
          </a>

          {/* Desktop nav links */}
          <nav className="hidden items-center gap-1 sm:flex" aria-label="Main navigation">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={[
                  'rounded-lg px-3 py-2 text-sm font-medium',
                  'text-text-primary/70 transition-colors duration-150',
                  'hover:text-gold hover:bg-gold/5',
                ].join(' ')}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right section: auth + language */}
          <div className="flex items-center gap-2">
            {/* Language switcher placeholder */}
            <button
              type="button"
              className={[
                'rounded-lg px-2.5 py-1.5 text-xs font-medium',
                'border border-gold/20 text-text-primary/60',
                'hover:text-gold hover:border-gold/50 transition-colors duration-150',
              ].join(' ')}
              aria-label="Switch language"
            >
              አማ
            </button>

            {/* Auth placeholder */}
            <a
              href="/auth/login"
              className={[
                'rounded-lg px-3.5 py-1.5 text-xs font-medium',
                'bg-gold text-bg-deep',
                'hover:bg-gold-mid transition-colors duration-150',
              ].join(' ')}
            >
              Login
            </a>
          </div>
        </div>
      </header>

      {/* Mobile slide-in menu */}
      <MobileMenu open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)}>
        <div className="mb-4 border-b border-gold/10 pb-3">
          <span className="text-sm font-semibold text-gold">የኢትዮጵያ ኦርቶዶክስ መዝሙራት</span>
        </div>
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={() => setMobileMenuOpen(false)}
            className={[
              'rounded-lg px-3 py-2.5 text-sm font-medium',
              'text-text-primary/70 transition-colors duration-150',
              'hover:text-gold hover:bg-gold/5',
            ].join(' ')}
          >
            {link.label}
          </a>
        ))}
        <div className="mt-4 border-t border-gold/10 pt-4">
          <a
            href="/auth/login"
            onClick={() => setMobileMenuOpen(false)}
            className={[
              'block rounded-lg px-3 py-2.5 text-center text-sm font-medium',
              'bg-gold text-bg-deep',
              'hover:bg-gold-mid transition-colors duration-150',
            ].join(' ')}
          >
            Login / Register
          </a>
        </div>
      </MobileMenu>
    </>
  );
}
