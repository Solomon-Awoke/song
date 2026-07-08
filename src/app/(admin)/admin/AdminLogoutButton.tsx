'use client';

import { signOut } from 'next-auth/react';
import { FiLogOut } from 'react-icons/fi';

export default function AdminLogoutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: '/login' })}
      className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-text-primary/60 transition-colors hover:text-red-accent hover:bg-red-accent/10"
    >
      <FiLogOut className="h-4 w-4" aria-hidden="true" />
      <span>Logout</span>
    </button>
  );
}
