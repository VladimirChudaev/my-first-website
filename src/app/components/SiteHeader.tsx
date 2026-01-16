'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import { FaTelegram, FaVk, FaYoutube, FaEnvelope } from 'react-icons/fa6';

export default function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="absolute top-0 w-full z-[100]">
      <div className="bg-gradient-to-b from-black/70 to-transparent">
        <div className="container mx-auto px-4 md:px-10 h-24 md:h-32 flex justify-between items-center">
          <div className="flex-shrink-0">
            <Link href="/" className="relative block w-32 h-12 md:w-56 md:h-24">
              <Image
                src="/photo/logo.png"
                alt="Logo"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-contain"
                priority
              />
            </Link>
          </div>

          <div className="hidden xl:flex items-center gap-10 text-white uppercase font-bold text-[12px] tracking-[0.2em]">
            <nav className="flex items-center gap-8">
              <Link href="/">Главная</Link>
              <Link href="/projects">Проекты</Link>
              <Link href="/partners">Партнеры</Link>
              <Link href="/film-reserve">Кинорезерв</Link>
              <Link href="/news">Новости</Link>
              <Link href="mailto:info@vtagency.ru" className="flex items-center gap-1">
                <FaEnvelope /> Email
              </Link>
            </nav>
            <div className="flex items-center gap-10 border-l border-white/20 pl-10">
              <span className="font-bold">+7 (922) 147 13-50</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 text-white text-xl md:text-2xl">
              <a href="https://t.me/VandTAgency" target="_blank" rel="noopener noreferrer">
                <FaTelegram />
              </a>
              <a href="https://vk.com/club230590987" target="_blank" rel="noopener noreferrer">
                <FaVk />
              </a>
              <a href="https://rutube.ru/channel/25381755/" target="_blank" rel="noopener noreferrer">
                <FaYoutube />
              </a>
              <a href="https://dzen.ru/vtagency" target="_blank" rel="noopener noreferrer">
                <Image
                  src="/photo/zen.svg"
                  alt="Дзен"
                  width={20}
                  height={20}
                  className="invert opacity-80"
                />
              </a>
            </div>

            <button
              className="xl:hidden text-4xl text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <HiX /> : <HiMenuAlt3 />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/98 z-[110] flex flex-col items-center justify-center gap-8 text-white text-2xl uppercase xl:hidden">
          <button
            onClick={() => setIsMenuOpen(false)}
            className="absolute top-8 right-8 text-4xl"
          >
            <HiX />
          </button>
          <Link href="/" onClick={() => setIsMenuOpen(false)}>Главная</Link>
          <Link href="/projects" onClick={() => setIsMenuOpen(false)}>Проекты</Link>
          <Link href="/contacts" onClick={() => setIsMenuOpen(false)}>Контакты</Link>
        </div>
      )}
    </header>
  );
}
