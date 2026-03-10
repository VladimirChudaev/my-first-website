'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import { FaTelegram, FaVk, FaYoutube } from 'react-icons/fa6';
import Logo from './Logo';
import { getMediaByDomain, getMediaUrl } from '@/lib/media/media';

export default function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [zenUrl, setZenUrl] = useState<string>('');

  useEffect(() => {
    const loadZen = async () => {
      try {
        const assets = await getMediaByDomain('photo');
        if (assets?.length) {
          const zen = assets.find(a => a.filename === 'zen.svg');
          if (zen?.path) setZenUrl(await getMediaUrl(zen.path));
        }
      } catch (e) { console.warn('Zen skipped'); }
    };
    loadZen();
  }, []);

  return (
    <header className="absolute top-0 left-0 w-full z-[100]">
      <div className="bg-black/20 backdrop-blur-md border-b border-white/5">
        <div className="container mx-auto px-6 h-20 md:h-32 flex justify-between items-center text-white">
          
          {/* ЛОГОТИП - Теперь с фиксированным размером и высшим приоритетом */}
          <div className="relative z-[210] flex-shrink-0 min-w-[120px] md:min-w-[220px]">
            <Link href="/" onClick={() => setIsMenuOpen(false)} className="block">
              <div className="w-28 md:w-56 h-10 md:h-24 relative">
                <Logo />
              </div>
            </Link>
          </div>

          {/* ДЕСКТОП МЕНЮ */}
          <nav className="hidden xl:flex items-center gap-8 uppercase font-bold text-[11px] tracking-[0.2em]">
            <Link href="/" className="hover:text-white/60">Главная</Link>
            <Link href="/projects" className="hover:text-white/60">Проекты</Link>
            <Link href="/partners" className="hover:text-white/60">Партнеры</Link>
            <Link href="/film-reserve" className="hover:text-white/60">Кинорезерв</Link>
            <Link href="/news" className="hover:text-white/60">Новости</Link>
          </nav>

          {/* ПРАВАЯ ЧАСТЬ */}
          <div className="flex items-center gap-5 z-[210]">
            <div className="hidden lg:flex items-center gap-4 text-xl">
              <a href="https://t.me/VandTAgency" target="_blank" className="hover:opacity-60"><FaTelegram /></a>
              <a href="https://vk.com/club230590987" target="_blank" className="hover:opacity-60"><FaVk /></a>
              <a href="https://rutube.ru/channel/25381755/" target="_blank" className="hover:opacity-60"><FaYoutube /></a>
              {zenUrl && (
                <a href="https://dzen.ru/vtagency" target="_blank" className="block w-5 h-5 relative">
                  <Image src={zenUrl} alt="Дзен" fill className="invert object-contain" />
                </a>
              )}
            </div>

            <button className="xl:hidden text-4xl" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <HiX /> : <HiMenuAlt3 />}
            </button>
          </div>
        </div>
      </div>

      {/* МОБИЛЬНОЕ МЕНЮ */}
      <div className={`fixed inset-0 bg-[#0a0a0a] transition-all duration-300 z-[150] xl:hidden ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col items-center justify-center h-full gap-8 text-white uppercase tracking-[0.2em] font-bold text-xl">
          <Link href="/" onClick={() => setIsMenuOpen(false)}>Главная</Link>
          <Link href="/projects" onClick={() => setIsMenuOpen(false)}>Проекты</Link>
          <Link href="/partners" onClick={() => setIsMenuOpen(false)}>Партнеры</Link>
          <Link href="/film-reserve" onClick={() => setIsMenuOpen(false)}>Кинорезерв</Link>
          <Link href="/news" onClick={() => setIsMenuOpen(false)}>Новости</Link>
          
          <div className="flex gap-8 text-3xl mt-12 pt-10 border-t border-white/10 w-64 justify-center">
             <a href="https://t.me/VandTAgency" target="_blank"><FaTelegram /></a>
             <a href="https://vk.com/club230590987" target="_blank"><FaVk /></a>
             <a href="https://rutube.ru/channel/25381755/" target="_blank"><FaYoutube /></a>
             {zenUrl && (
                <div className="w-8 h-8 relative">
                  <Image src={zenUrl} alt="Дзен" fill className="invert object-contain" />
                </div>
              )}
          </div>
        </div>
      </div>
    </header>
  );
}