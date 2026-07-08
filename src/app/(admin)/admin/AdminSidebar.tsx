'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiMusic, FiGrid, FiUsers, FiUpload, FiShield } from 'react-icons/fi';

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: FiHome },
  { label: 'Songs', href: '/admin/songs', icon: FiMusic },
  { label: 'Categories', href: '/admin/categories', icon: FiGrid },
  { label: 'Users', href: '/admin/users', icon: FiUsers },
  { label: 'Import', href: '/admin/import', icon: FiUpload },
  { label: 'Moderation', href: '/admin/moderation', icon: FiShield },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-60 flex-col border-r border-gold/10 bg-bg-mid">
      {/* Logo section */}
      <div className="flex h-14 items-center gap-2 border-b border-gold/10 px-5">
        <span className="ethiopian-cross text-gold-light" aria-hidden="true" />
        <span className="text-sm font-bold tracking-wide text-gold">
          Admin Panel
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label="Admin navigation">
        {navItems.map((item) => {
          const isActive =
            item.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-gold/10 text-gold border-l-2 border-gold pl-[10px]'
                  : 'text-text-primary/60 hover:text-gold hover:bg-gold/5 border-l-2 border-transparent pl-[10px]',
              ].join(' ')}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-gold/10 p-3">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-text-primary/40 transition-colors hover:text-gold"
        >
          ← Back to site
        </Link>
      </div>
    </aside>
  );
}
