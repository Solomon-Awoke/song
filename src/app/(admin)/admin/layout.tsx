import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import AdminSidebar from './AdminSidebar';
import AdminLogoutButton from './AdminLogoutButton';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const role = (session?.user as any)?.role;

  if (!session?.user || role !== 'admin') {
    redirect('/login?callbackUrl=/admin');
  }

  return (
    <div className="flex min-h-screen bg-bg-deep">
      <AdminSidebar />
      <div className="ml-60 flex min-w-0 flex-1 flex-col">
        {/* Admin header */}
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b border-gold/10 bg-bg-mid/95 px-6 backdrop-blur-sm">
          <h1 className="text-lg font-bold tracking-wide text-gold">
            Admin Panel
          </h1>
          <AdminLogoutButton />
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
