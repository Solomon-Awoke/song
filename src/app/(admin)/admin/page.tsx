import Link from 'next/link';
import { FiMusic, FiGrid, FiUsers, FiUpload } from 'react-icons/fi';

const quickLinks = [
  {
    label: 'Manage Songs',
    description: 'Add, edit, or remove songs from the collection',
    href: '/admin/songs',
    icon: FiMusic,
  },
  {
    label: 'Categories',
    description: 'Organize songs by category',
    href: '/admin/categories',
    icon: FiGrid,
  },
  {
    label: 'Users',
    description: 'Manage user accounts and permissions',
    href: '/admin/users',
    icon: FiUsers,
  },
  {
    label: 'Import',
    description: 'Bulk import songs from file',
    href: '/admin/import',
    icon: FiUpload,
  },
];

export default function AdminDashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-text-primary">Welcome to the Admin Panel</h2>
        <p className="mt-1 text-sm text-text-primary/50">
          Manage your Ethiopian Orthodox Tewahedo spiritual songs collection
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {quickLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="group rounded-xl border border-gold/10 bg-bg-mid p-5 transition-all duration-200 hover:-translate-y-1 hover:border-gold/30 hover:shadow-lg hover:shadow-black/20"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10 text-gold transition-colors group-hover:bg-gold/20">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="font-semibold text-text-primary group-hover:text-gold transition-colors">
                {link.label}
              </h3>
              <p className="mt-1 text-xs text-text-primary/40">
                {link.description}
              </p>
            </Link>
          );
        })}
      </div>

      {/* Quick stats placeholder */}
      <div className="mt-10 rounded-xl border border-gold/10 bg-bg-mid p-6">
        <h3 className="mb-4 text-lg font-semibold text-text-primary">Getting Started</h3>
        <ul className="space-y-3 text-sm text-text-primary/60">
          <li className="flex items-start gap-3">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold/20 text-xs font-bold text-gold">1</span>
            <span>Add categories to organize your songs (e.g., &#34;Wudasse&#34;, &#34;Mezmur&#34;, &#34;Qene&#34;)</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold/20 text-xs font-bold text-gold">2</span>
            <span>Create songs with Amharic lyrics, English translations, and biblical references</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold/20 text-xs font-bold text-gold">3</span>
            <span>Review and approve pending submissions in Moderation</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
