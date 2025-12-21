'use client';

import Image from "next/image";
import Link from "next/link";
import { FaTelegram, FaVk, FaYoutube, FaEnvelope, FaPhone, FaLocationDot } from 'react-icons/fa6';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1a1a1a] text-white py-12 md:py-16 border-t border-white/5">
      <div className="container mx-auto px-6 lg:px-20">
        {/* Адаптивная сетка: 1 колонка на мобильном, 12 на десктопе */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16 items-start">
          
          {/* Логотип: Центрируем на мобилках */}
          <div className="md:col-span-4 flex justify-center md:justify-start">
            <Image 
              src="/photo/logo.png" 
              alt="V&T Agency" 
              width={280} 
              height={160} 
              className="object-contain w-[220px] md:w-[280px]" // На мобильном чуть меньше
              priority
            />
          </div>

          {/* Навигация: Центрируем текст на мобилках */}
          <div className="md:col-span-3 flex flex-col items-center md:items-start gap-5">
            <h4 className="text-white font-bold uppercase text-[10px] tracking-[0.2em] opacity-40">Навигация</h4>
            <nav className="flex flex-col items-center md:items-start gap-4 text-xl">
              <Link href="/" className="hover:text-blue-400 transition-colors">Главная</Link>
              <Link href="#" className="hover:text-blue-400 transition-colors">Кинокомпания</Link>
              <Link href="#" className="hover:text-blue-400 transition-colors">Проекты</Link>
              <Link href="#" className="hover:text-blue-400 transition-colors">Новости</Link>
            </nav>
          </div>

          {/* Контакты: Центрируем на мобилках */}
          <div className="md:col-span-3 flex flex-col items-center md:items-start gap-6 text-center md:text-left">
            <h4 className="text-white font-bold uppercase text-[10px] tracking-[0.2em] opacity-40">Контакты</h4>
            <div className="flex flex-col md:flex-row items-center gap-3 text-xl">
              <FaEnvelope className="text-white/20 text-xl hidden md:block" />
              <a href="mailto:info@vtagency.ru" className="hover:text-blue-400">info@vtagency.ru</a>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-3 text-xl font-semibold">
              <FaPhone className="text-white/20 text-xl hidden md:block" />
              <a href="tel:+79221471350" className="hover:text-blue-400">+7 (922) 147 13-50</a>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-3 text-xl">
              <FaLocationDot className="text-white/20 text-xl hidden md:block" />
              <span>Екатеринбург, ул. Союзная, 2</span>
            </div>
          </div>

          {/* Соцсети */}
          <div className="md:col-span-2 flex flex-col items-center md:items-end gap-6">
            <h4 className="text-white font-bold uppercase text-[10px] tracking-[0.2em] opacity-40">Мы в сети</h4>
            <div className="flex gap-6 text-3xl">
              <a href="#" className="hover:text-blue-400"><FaTelegram /></a>
              <a href="#" className="hover:text-blue-400"><FaVk /></a>
              <a href="#" className="hover:text-blue-400"><FaYoutube /></a>
            </div>
          </div>
        </div>

        {/* Подвал: Политика и копирайт */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[9px] tracking-[0.2em] uppercase opacity-30 text-center">
          <p>© {currentYear} ООО «Кинокомпания Ви Эн Ти». ВСЕ ПРАВА ЗАЩИЩЕНЫ.</p>
          <Link href="/privacy" className="underline underline-offset-8 decoration-white/20">
            Политика конфиденциальности
          </Link>
        </div>
      </div>
    </footer>
  );
}