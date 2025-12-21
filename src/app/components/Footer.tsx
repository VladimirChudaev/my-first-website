'use client';

import Image from "next/image";
import Link from "next/link";
import { FaTelegram, FaVk, FaYoutube, FaEnvelope, FaPhone, FaLocationDot } from 'react-icons/fa6';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1a1a1a] text-white py-16 border-t border-white/5">
      <div className="container mx-auto px-4 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16 items-start">
          
          {/* Логотип - Увеличен размер в соответствии с образцом */}
          <div className="md:col-span-4">
            <div className="flex flex-col items-start">
              <Image 
                src="/photo/logo.png" 
                alt="V&T Agency" 
                width={340} // Значительно увеличили ширину для акцента как на образце
                height={270} // Пропорционально увеличили высоту
                className="object-contain" 
                priority
              />
              {/* Текст под логотипом удален по вашему требованию */}
            </div>
          </div>

          {/* Навигация - Крупный шрифт */}
          <div className="md:col-span-3 flex flex-col gap-6">
            <h4 className="text-white font-bold uppercase text-xs tracking-[0.2em] opacity-40">Навигация</h4>
            <nav className="flex flex-col gap-4 text-xl font-medium"> {/* Увеличен до text-xl */}
              <Link href="/" className="hover:text-blue-400 transition-colors">Главная</Link>
              <Link href="#" className="hover:text-blue-400 transition-colors">Кинокомпания</Link>
              <Link href="#" className="hover:text-blue-400 transition-colors">Проекты</Link>
              <Link href="#" className="hover:text-blue-400 transition-colors">Новости</Link>
            </nav>
          </div>

          {/* Контакты - Крупный шрифт */}
          <div className="md:col-span-3 flex flex-col gap-6">
            <h4 className="text-white font-bold uppercase text-xs tracking-[0.2em] opacity-40">Контакты</h4>
            <div className="flex items-center gap-4 text-xl"> {/* Увеличен до text-xl */}
              <FaEnvelope className="text-white/20 text-2xl" />
              <a href="mailto:info@vtagency.ru" className="hover:text-blue-400 transition-colors">info@vtagency.ru</a>
            </div>
            <div className="flex items-center gap-4 text-xl font-semibold">
              <FaPhone className="text-white/20 text-2xl" />
              <a href="tel:+79221471350" className="hover:text-blue-400 transition-colors">+7 (922) 147 13-50</a>
            </div>
            <div className="flex items-start gap-4 text-xl">
              <FaLocationDot className="text-white/20 text-2xl mt-1" />
              <span className="leading-tight">Екатеринбург, ул. Союзная, 2</span>
            </div>
          </div>

          {/* Соцсети - Мы в сети */}
          <div className="md:col-span-2 flex flex-col items-start md:items-end gap-6">
            <h4 className="text-white font-bold uppercase text-xs tracking-[0.2em] opacity-40">Мы в сети</h4>
            <div className="flex gap-5 text-3xl"> {/* Крупные иконки как на образце */}
              <a href="https://t.me/+Yj_bim_Qdi9mMTcy" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-transform hover:scale-110">
                <FaTelegram />
              </a>
              <a href="https://vk.com/club230590987?from=groups" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-transform hover:scale-110">
                <FaVk />
              </a>
              <a href="https://rutube.ru/channel/25381755/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-transform hover:scale-110">
                <FaYoutube />
              </a>
              <a href="https://dzen.ru/vtagency" target="_blank" rel="noopener noreferrer" className="hover:opacity-100 transition-opacity">
                <Image src="/photo/zen.svg" alt="Zen" width={32} height={32} className="invert opacity-70" />
              </a>
            </div>
          </div>
        </div>

        {/* Нижняя панель - Мелкий шрифт, подчеркивание политики */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[9px] tracking-[0.2em] uppercase opacity-30">
          <p>© {currentYear} ООО «Кинокомпания Ви Эн Ти». ВСЕ ПРАВА ЗАЩИЩЕНЫ.</p>
          <Link 
            href="/privacy" 
            className="hover:text-white transition-colors mt-4 md:mt-0 underline decoration-white/30 underline-offset-8"
          >
            Политика конфиденциальности
          </Link>
        </div>
      </div>
    </footer>
  );
}