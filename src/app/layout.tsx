'use client';

import { usePathname } from 'next/navigation';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SiteHeader from './components/SiteHeader';
import Footer from './components/Footer';

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '';
  // Проверяем, начинается ли путь с /admin
  const isAdmin = pathname.startsWith('/admin');

  return (
    <html lang="ru">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Хедер и Футер сайта показываем ТОЛЬКО если это НЕ админка */}
        {!isAdmin && <SiteHeader />}
        
        <div className={!isAdmin ? "flex flex-col min-h-screen" : ""}>
          <main className={!isAdmin ? "flex-grow" : ""}>
            {children}
          </main>
        </div>

        {!isAdmin && <Footer />}
      </body>
    </html>
  );
}