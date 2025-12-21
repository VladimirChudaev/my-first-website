'use client';

import Image from "next/image";
import Link from "next/link";
import { FaTelegram, FaVk, FaYoutube, FaEnvelope, FaPhone, FaLocationDot } from 'react-icons/fa6';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1a1a1a] text-white/70 py-16 border-t border-white/5">
      <div className="container mx-auto px-4 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          
          {/* Логотип и описание */}
          <div className="md:col-span-4 flex flex-col items-start">
            <div className="mb-6 opacity-90">
              <Image src="/photo/logo.png" alt="V&T Agency" width={180} height={50} className="object-contain" />
            </div>
            <p className="text-sm leading-relaxed max-w-xs opacity-60 font-light">
              Кинокомпания полного цикла. Более 25 лет создаем смыслы и воплощаем идеи на экране.
            </p>
          </div>

          {/* Навигация */}
          <div className="md:col-span-3 flex flex-col gap-4">
            <h4 className="text-white font-semibold mb-2 uppercase text-xs tracking-[0.2em]">Навигация</h4>
            <nav className="flex flex-col gap-3 text-sm">
              <Link href="/" className="hover:text-white transition-colors">Главная</Link>
              <Link href="#" className="hover:text-white transition-colors">Кинокомпания</Link>
              <Link href="#" className="hover:text-white transition-colors">Проекты</Link>
              <Link href="#" className="hover:text-white transition-colors">Новости</Link>
            </nav>
          </div>

          {/* Контакты */}
          <div className="md:col-span-3 flex flex-col gap-5">
            <h4 className="text-white font-semibold mb-2 uppercase text-xs tracking-[0.2em]">Контакты</h4>
            <div className="flex items-center gap-3 text-sm">
              <FaEnvelope className="text-white/30" />
              <a href="mailto:info@vtagency.ru" className="hover:text-white transition-colors">info@vtagency.ru</a>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <FaPhone className="text-white/30" />
              <a href="tel:+79221471350" className="hover:text-white transition-colors">+7 (922) 147 13-50</a>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <FaLocationDot className="text-white/30 mt-1" />
              <span className="leading-tight opacity-80">Екатеринбург, ул. Союзная, 2</span>
            </div>
          </div>

          {/* Соцсети */}
          <div className="md:col-span-2 flex flex-col items-start md:items-end gap-6">
            <h4 className="text-white font-semibold mb-2 uppercase text-xs tracking-[0.2em]">Мы в сети</h4>
            <div className="flex gap-5 text-2xl">
              <a href="https://t.me/+Yj_bim_Qdi9mMTcy" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-all">
                <FaTelegram />
              </a>
              <a href="https://vk.com/club230590987?from=groups" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-all">
                <FaVk />
              </a>
              <a href="https://rutube.ru/channel/25381755/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-all">
                <FaYoutube />
              </a>
              <a href="https://dzen.ru/vtagency" target="_blank" rel="noopener noreferrer" className="hover:opacity-100 transition-opacity">
                <Image src="/photo/zen.svg" alt="Zen" width={22} height={22} className="invert opacity-70" />
              </a>
            </div>
          </div>
        </div>

        {/* Копирайт */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[11px] tracking-wider uppercase opacity-40">
          <p>© {currentYear} ООО «Кинокомпания Ви Эн Ти». ВСЕ ПРАВА ЗАЩИЩЕНЫ.</p>
          <Link href="/privacy" className="hover:text-white transition-colors mt-4 md:mt-0 underline underline-offset-4">
            Политика конфиденциальности
          </Link>
        </div>
      </div>
    </footer>
  );
}