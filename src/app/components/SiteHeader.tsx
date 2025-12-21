'use client';
import Image from "next/image";
import { FaTelegram, FaVk, FaYoutube, FaEnvelope } from 'react-icons/fa6';

export default function SiteHeader() {
  const navigationItems = [
    { label: "Главная", href: "#" },
    { label: "Проекты", href: "#" },
    { label: "Партнеры", href: "#" },
    { label: "Кинорезерв", href: "#" },
    { label: "Новости", href: "#" },
    { label: <span className="flex items-center gap-1"><FaEnvelope /> Email</span>, href: "mailto:info@vtagency.ru" },
    { label: <span className="font-bold">+7(922) 147 13-50</span> },
  ];

  return (
    <header className="absolute top-0 left-0 w-full z-50 bg-black/10 backdrop-blur-sm">
      <div className="w-full py-8 flex items-center justify-between px-10">
        <Image src="/photo/logo.png" alt="Logo" width={200} height={60} className="object-contain" />
        
        <nav className="flex gap-8 text-white/90 text-base font-medium">
          {navigationItems.map((item, i) => (
            <a key={i} href={item.href} className="hover:text-white transition-colors">{item.label}</a>
          ))}
        </nav>

        <div className="flex gap-5 text-xl text-white/80">
          <a href="https://t.me/+Yj_bim_Qdi9mMTcy" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><FaTelegram /></a>
          <a href="https://vk.com/club230590987?from=groups" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><FaVk /></a>
          <a href="https://rutube.ru/channel/25381755/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><FaYoutube /></a>
          <a href="https://dzen.ru/vtagency" target="_blank" rel="noopener noreferrer">
            <Image src="/photo/zen.svg" alt="Zen" width={20} height={20} className="invert opacity-80 hover:opacity-100 transition-opacity" />
          </a>
        </div>
      </div>
    </header>
  );
}