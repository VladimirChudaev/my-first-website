'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import { FaTelegram, FaVk, FaEnvelope } from 'react-icons/fa6';
import Logo from './Logo';
import { getMediaByDomain, getMediaUrl } from '@/lib/media/media';

export default function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [zenUrl, setZenUrl] = useState<string>('');
  const [rutubeUrl, setRutubeUrl] = useState<string>('');

  useEffect(() => {
    const loadIcons = async () => {
      try {
        const assets = await getMediaByDomain('photo');
        if (assets?.length) {
          const zen = assets.find(a => a.filename === 'zen.svg');
          if (zen?.path) setZenUrl(await getMediaUrl(zen.path));

          const rutube = assets.find(a => a.filename === 'rutube.svg');
          if (rutube?.path) setRutubeUrl(await getMediaUrl(rutube.path));
        }
      } catch (e) {
        console.warn('Icons loading failed');
      }
    };
    loadIcons();
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMenuOpen]);

  const SocialIcons = ({ sizeClass = "w-5 h-5", iconSize = "text-xl" }) => (
    <>
      <a href="https://t.me/VandTAgency" target="_blank" className={`hover:opacity-60 text-white ${iconSize}`}><FaTelegram /></a>
      <a href="https://vk.com/club230590987" target="_blank" className={`hover:opacity-60 text-white ${iconSize}`}><FaVk /></a>
      
      {/* RUTUBE - Обесцвечиваем и инвертируем цветной оригинал в белый */}
      {rutubeUrl && (
        <a href="https://rutube.ru/channel/25381755/" target="_blank" className="hover:opacity-60">
          <div className={`${sizeClass} relative`}>
            <Image 
              src={rutubeUrl} 
              alt="Rutube" 
              fill 
              className="object-contain grayscale invert" 
              priority 
            />
          </div>
        </a>
      )}

      {/* DZEN - Инвертируем черный квадрат в белый */}
      {zenUrl && (
        <a href="https://dzen.ru/vtagency" target="_blank" className="hover:opacity-60">
          <div className={`${sizeClass} relative`}>
            <Image 
              src={zenUrl} 
              alt="Дзен" 
              fill 
              className="object-contain invert" 
              priority 
            />
          </div>
        </a>
      )}
    </>
  );

  return (
    <header className="absolute top-0 left-0 w-full z-[100]">
      <div className="bg-black/20 backdrop-blur-md border-b border-white/5">
        <div className="container mx-auto px-4 lg:px-10 h-20 md:h-32 flex justify-between items-center text-white">
          
          {/* ЛОГОТИП КОМПАНИИ */}
          <div className="relative z-[210] flex-shrink-0">
            <Link href="/" onClick={() => setIsMenuOpen(false)} className="block">
              <div className="w-28 md:w-56 h-10 md:h-24 relative">
                <Logo />
              </div>
            </Link>
          </div>

          {/* ДЕСКТОП МЕНЮ */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-8 uppercase font-bold text-[10px] xl:text-[11px] tracking-[0.15em] xl:tracking-[0.2em]">
            <nav className="flex items-center gap-4 xl:gap-8">
              <Link href="/" className="hover:text-white/60">Главная</Link>
              <Link href="/projects" className="hover:text-white/60">Проекты</Link>
              <Link href="/partners" className="hover:text-white/60">Партнеры</Link>
              <Link href="/film-reserve" className="hover:text-white/60">Кинорезерв</Link>
              <Link href="/news" className="hover:text-white/60">Новости</Link>
            </nav>
            <div className="flex items-center gap-4 xl:gap-6 border-l border-white/20 pl-4 xl:pl-6">
              <a href="mailto:info@vtagency.ru" className="flex items-center gap-2 hover:text-white/60">
                <FaEnvelope className="opacity-50" /> <span className="lowercase font-normal tracking-normal text-white">info@vtagency.ru</span>
              </a>
              <span className="text-nowrap">+7 (922) 147 13-50</span>
            </div>
          </div>

          {/* СОЦСЕТИ И БУРГЕР */}
          <div className="flex items-center gap-5 z-[210]">
            <div className="hidden xl:flex items-center gap-4">
              <SocialIcons />
            </div>
            <button className="lg:hidden text-4xl p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <HiX /> : <HiMenuAlt3 />}
            </button>
          </div>
        </div>
      </div>

      {/* МОБИЛЬНОЕ МЕНЮ */}
      <div className={`fixed inset-0 bg-[#0a0a0a] transition-all duration-300 z-[150] lg:hidden ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col items-center justify-center h-full gap-6 text-white uppercase tracking-[0.2em] font-bold text-xl px-6">
          <Link href="/" onClick={() => setIsMenuOpen(false)}>Главная</Link>
          <Link href="/projects" onClick={() => setIsMenuOpen(false)}>Проекты</Link>
          <Link href="/partners" onClick={() => setIsMenuOpen(false)}>Партнеры</Link>
          <Link href="/film-reserve" onClick={() => setIsMenuOpen(false)}>Кинорезерв</Link>
          <Link href="/news" onClick={() => setIsMenuOpen(false)}>Новости</Link>
          <div className="flex flex-col items-center gap-4 mt-8 pt-8 border-t border-white/10 w-full max-w-[280px]">
             <a href="tel:+79221471350" className="text-lg font-bold tracking-widest text-white">+7 (922) 147 13-50</a>
             <a href="mailto:info@vtagency.ru" className="text-sm lowercase font-light tracking-normal opacity-70">info@vtagency.ru</a>
             <div className="flex items-center justify-center gap-6 mt-6">
               <SocialIcons sizeClass="w-8 h-8" iconSize="text-3xl" />
             </div>
          </div>
        </div>
      </div>
    </header>
  );
}