'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import MobileMenu from './MobileMenu';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session } = useSession();
  const user = session?.user;

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Browse', href: '/songs' },
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

            {/* Auth: user info or login */}
            {user ? (
              <div className="flex items-center gap-2">
                <span className="hidden text-sm text-text-primary/70 sm:block">
                  {user.name || user.email}
                </span>
                <div className="group relative">
                  <button className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/20 text-sm font-bold text-gold transition-colors hover:bg-gold/30">
                    {(user.name || user.email || '?').charAt(0).toUpperCase()}
                  </button>
                  {/* Dropdown */}
                  <div className="absolute right-0 top-full z-50 mt-1 w-48 origin-top-right scale-95 rounded-lg border border-gold/10 bg-bg-mid p-1.5 opacity-0 shadow-2xl transition-all duration-150 group-hover:scale-100 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto">
                    <a href="/my/favorites" className="block rounded-md px-3 py-2 text-sm text-text-primary/70 transition-colors hover:bg-gold/10 hover:text-gold">❤️ Favorites</a>
                    <a href="/my/playlists" className="block rounded-md px-3 py-2 text-sm text-text-primary/70 transition-colors hover:bg-gold/10 hover:text-gold">📋 Playlists</a>
                    {(user as any)?.role === 'admin' && <a href="/admin" className="block rounded-md px-3 py-2 text-sm text-text-primary/70 transition-colors hover:bg-gold/10 hover:text-gold">🔧 Admin</a>}
                    <hr className="my-1 border-gold/10" />
                    <button onClick={() => signOut({ callbackUrl: '/' })} className="w-full rounded-md px-3 py-2 text-left text-sm text-red-accent/70 transition-colors hover:bg-red-accent/10">🚪 Logout</button>
                  </div>
                </div>
              </div>
            ) : (
              <a href="/login" className="rounded-lg bg-gold px-3.5 py-1.5 text-xs font-medium text-bg-deep transition-colors hover:bg-gold-mid">Login</a>
            )}
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
        {user ? (
          <div className="mt-4 border-t border-gold/10 pt-4 space-y-1">
            <div className="px-3 py-2 text-sm font-medium text-gold">{user.name || user.email}</div>
            <a href="/my/favorites" onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm font-medium text-text-primary/70 hover:text-gold hover:bg-gold/5">❤️ Favorites</a>
            <a href="/my/playlists" onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm font-medium text-text-primary/70 hover:text-gold hover:bg-gold/5">📋 Playlists</a>
            {(user as any)?.role === 'admin' && <a href="/admin" onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm font-medium text-text-primary/70 hover:text-gold hover:bg-gold/5">🔧 Admin</a>}
            <button onClick={() => { setMobileMenuOpen(false); signOut({ callbackUrl: '/' }); }} className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-accent/70 hover:bg-red-accent/10">🚪 Logout</button>
          </div>
        ) : (
          <div className="mt-4 border-t border-gold/10 pt-4">
            <a href="/login" onClick={() => setMobileMenuOpen(false)} className="block rounded-lg bg-gold px-3 py-2.5 text-center text-sm font-medium text-bg-deep hover:bg-gold-mid">Login / Register</a>
          </div>
        )}
      </MobileMenu>
    </>
  );
}
