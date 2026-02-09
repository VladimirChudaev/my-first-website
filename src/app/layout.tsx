import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SiteHeader from './components/SiteHeader';
import Footer from './components/Footer';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "V&T Agency | От идеи до экрана",
  description: "Кинокомпания V&T Agency — более 25 лет в кино и телевидении.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <SiteHeader />
        {/* Добавляем main с отступом pt-24 или pt-32 и flex-grow для футера */}
        <main className="pt-24 flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}