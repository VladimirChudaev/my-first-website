'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  FaTelegram,
  FaVk,
  FaEnvelope,
  FaPhone,
  FaLocationDot,
  FaLock
} from 'react-icons/fa6';
import Logo from './Logo';
import { getMediaByDomain, getMediaUrl } from '@/lib/media/media';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [zenUrl, setZenUrl] = useState<string>('');
  const [rutubeUrl, setRutubeUrl] = useState<string>('');

  useEffect(() => {
    const loadIcons = async () => {
      try {
        const assets = await getMediaByDomain('photo');
        if (assets?.length) {
          // Загрузка Дзена
          const zen = assets.find(a => a.filename === 'zen.svg');
          if (zen?.path) setZenUrl(await getMediaUrl(zen.path));

          // Загрузка Rutube
          const rutube = assets.find(a => a.filename === 'rutube.svg');
          if (rutube?.path) setRutubeUrl(await getMediaUrl(rutube.path));
        }
      } catch (e) {
        console.warn('Footer icons load error');
      }
    };

    loadIcons();
  }, []);

  return (
    <footer className="bg-[#1a1a1a] text-white py-12 md:py-16 border-t border-white/5">
      <div className="container mx-auto px-6 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16 items-start">

          {/* Логотип */}
          <div className="md:col-span-4 flex justify-center md:justify-start">
            <div className="relative w-[280px] md:w-[320px] aspect-[16/9]">
              <Logo />
            </div>
          </div>

          {/* Навигация */}
          <div className="md:col-span-3 flex flex-col items-center md:items-start gap-5">
            <h4 className="text-white font-bold uppercase text-[10px] tracking-[0.2em] opacity-40">
              Навигация
            </h4>
            <nav className="flex flex-col items-center md:items-start gap-4 text-xl">
              <Link href="/" className="hover:text-gray-400 transition-colors">Главная</Link>
              <Link href="/projects" className="hover:text-gray-400 transition-colors">Проекты</Link>
              <Link href="/partners" className="hover:text-gray-400 transition-colors">Партнёры</Link>
              <Link href="/film-reserve" className="hover:text-gray-400 transition-colors">Кинорезерв</Link>
              <Link href="/news" className="hover:text-gray-400 transition-colors">Новости</Link>
            </nav>
          </div>

          {/* Контакты */}
          <div className="md:col-span-3 flex flex-col items-center md:items-start gap-6 text-center md:text-left">
            <h4 className="text-white font-bold uppercase text-[10px] tracking-[0.2em] opacity-40">
              Контакты
            </h4>

            <div className="flex items-center gap-3 text-xl hover:text-gray-400 transition-colors">
              <FaEnvelope className="text-white/20 hidden md:block" />
              <a href="mailto:info@vtagency.ru">info@vtagency.ru</a>
            </div>

            <div className="flex items-center gap-3 text-xl font-semibold">
              <FaPhone className="text-white/20 hidden md:block" />
              <span>+7 (922) 147 13-50</span>
            </div>

            <div className="flex items-center gap-3 text-xl">
              <FaLocationDot className="text-white/20 hidden md:block" />
              <span>Екатеринбург, ул. Союзная, 2</span>
            </div>
          </div>

          {/* Соцсети */}
          <div className="md:col-span-2 flex flex-col items-center md:items-end gap-6">
            <h4 className="text-white font-bold uppercase text-[10px] tracking-[0.2em] opacity-40">
              Мы в сети
            </h4>

            <div className="flex items-center gap-6 text-3xl">
              <a href="https://t.me/VandTAgency" target="_blank" className="hover:text-gray-400 transition-colors"><FaTelegram /></a>
              <a href="https://vk.com/club230590987" target="_blank" className="hover:text-gray-400 transition-colors"><FaVk /></a>
              
              {/* RUTUBE - Обесцвечиваем и инвертируем в белый */}
              {rutubeUrl && (
                <a href="https://rutube.ru/channel/25381755/" target="_blank" className="hover:opacity-60 transition-opacity">
                  <div className="w-7 h-7 relative">
                    <Image
                      src={rutubeUrl}
                      alt="Rutube"
                      fill
                      className="object-contain grayscale invert"
                    />
                  </div>
                </a>
              )}

              {/* DZEN - Инвертируем черный в белый */}
              {zenUrl && (
                <a href="https://dzen.ru/vtagency" target="_blank" className="hover:opacity-60 transition-opacity">
                  <div className="w-7 h-7 relative">
                    <Image
                      src={zenUrl}
                      alt="Дзен"
                      fill
                      className="object-contain invert"
                    />
                  </div>
                </a>
              )}

              <Link href="/auth/login" className="opacity-20 hover:opacity-100 transition-opacity">
                <FaLock className="text-2xl" />
              </Link>
            </div>
          </div>
        </div>

        {/* Копирайт */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[9px] tracking-[0.2em] uppercase opacity-30 text-center">
          <p>© {currentYear} ООО «Кинокомпания Ви Эн Ти». ВСЕ ПРАВА ЗАЩИЩЕНЫ.</p>
          <Link href="/privacy" className="underline underline-offset-8 decoration-white/20 hover:text-white transition-colors">
            Политика конфиденциальности
          </Link>
        </div>
      </div>
    </footer>
  );
}