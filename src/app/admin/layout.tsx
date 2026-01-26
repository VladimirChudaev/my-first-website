// app/admin/layout.tsx

import { ReactNode } from 'react';
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

  return <>{children}</>;
}
