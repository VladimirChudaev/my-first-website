import { ReactNode } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/server';

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r">
        <div className="p-4 font-semibold text-lg">
          Admin
        </div>

        <nav className="px-4 space-y-2">
          <Link href="/admin/news" className="block px-3 py-2 rounded hover:bg-gray-100">
            News
          </Link>
          <Link href="/admin/pages" className="block px-3 py-2 rounded hover:bg-gray-100">
            Pages
          </Link>
          <Link href="/admin/content" className="block px-3 py-2 rounded hover:bg-gray-100">
            Content
          </Link>
          <Link href="/admin/media" className="block px-3 py-2 rounded hover:bg-gray-100">
            Media
          </Link>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}
