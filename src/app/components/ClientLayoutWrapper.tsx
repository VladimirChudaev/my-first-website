'use client';

import { usePathname } from 'next/navigation';
import SiteHeader from './SiteHeader';
import Footer from './Footer';

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '';
  const isAdmin = pathname.startsWith('/admin');

  return (
    <>
      {!isAdmin && <SiteHeader />}
      <div className={!isAdmin ? "flex flex-col min-h-screen" : ""}>
        <main className={!isAdmin ? "flex-grow" : ""}>
          {children}
        </main>
      </div>
      {!isAdmin && <Footer />}
    </>
  );
}