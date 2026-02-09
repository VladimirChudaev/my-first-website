'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import { FaTelegram, FaVk, FaYoutube, FaEnvelope } from 'react-icons/fa6';
import Logo from './Logo';
import { getMediaByDomain, getMediaUrl } from '@/lib/media/media';

export default function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [zenUrl, setZenUrl] = useState<string>('');

  useEffect(() => {
    const loadZen = async () => {
      try {
        const assets = await getMediaByDomain('photo');
        const zen = assets.find(a => a.filename === 'zen.svg');
        if (zen?.path) {
          const url = await getMediaUrl(zen.path);
          setZenUrl(url);
        }
      } catch (e) {
        console.error('Error loading icons:', e);
      }
    };
    loadZen();
  }, []);

  return (
    <header className="absolute top-0 left-0 w-full z-[100] bg-transparent">
      {/* Фон хедера: 90% прозрачности (bg-black/10) */}
      <div className="bg-black/10 backdrop-blur-[2px]">
        <div className="container mx-auto px-4 md:px-10 h-24 md:h-32 flex justify-between items-center text-white">
          
          <div className="flex-shrink-0">
            <Link href="/" className="relative block w-32 h-12 md:w-56 md:h-24">
              <Logo />
            </Link>
          </div>

          <div className="hidden xl:flex items-center gap-10 uppercase font-bold text-[12px] tracking-[0.2em]">
            <nav className="flex items-center gap-8">
              <Link href="/" className="hover:text-white/70 transition-colors">Главная</Link>
              <Link href="/projects" className="hover:text-white/70 transition-colors">Проекты</Link>
              <Link href="/partners" className="hover:text-white/70 transition-colors">Партнеры</Link>
              <Link href="/film-reserve" className="hover:text-white/70 transition-colors">Кинорезерв</Link>
              <Link href="/news" className="hover:text-white/70 transition-colors">Новости</Link>
              <a href="mailto:info@vtagency.ru" className="flex items-center gap-1 hover:text-white/70 transition-colors">
                <FaEnvelope /> Email
              </a>
            </nav>
            <div className="flex items-center gap-10 border-l border-white/20 pl-10">
              <span className="font-bold text-nowrap">+7 (922) 147 13-50</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 text-xl md:text-2xl">
              <a href="https://t.me/VandTAgency" target="_blank" rel="noopener noreferrer" className="hover:opacity-70">
                <FaTelegram />
              </a>
              <a href="https://vk.com/club230590987" target="_blank" rel="noopener noreferrer" className="hover:opacity-70">
                <FaVk />
              </a>
              <a href="https://rutube.ru/channel/25381755/" target="_blank" rel="noopener noreferrer" className="hover:opacity-70">
                <FaYoutube />
              </a>
              {zenUrl && (
                <a href="https://dzen.ru/vtagency" target="_blank" rel="noopener noreferrer" className="hover:opacity-70">
                  <Image src={zenUrl} alt="Дзен" width={20} height={20} className="invert" />
                </a>
              )}
            </div>
            <button className="xl:hidden text-4xl" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <HiX /> : <HiMenuAlt3 />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/95 z-[110] flex flex-col items-center justify-center gap-8 text-white text-2xl uppercase xl:hidden">
          <button onClick={() => setIsMenuOpen(false)} className="absolute top-8 right-8 text-4xl"><HiX /></button>
          <Link href="/" onClick={() => setIsMenuOpen(false)}>Главная</Link>
          <Link href="/projects" onClick={() => setIsMenuOpen(false)}>Проекты</Link>
          <Link href="/contacts" onClick={() => setIsMenuOpen(false)}>Контакты</Link>
        </div>
      )}
    </header>
  );
}