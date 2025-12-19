'use client';

import { FaTelegram, FaVk, FaYoutube, FaEnvelope, FaPhone } from 'react-icons/fa6';

export default function SiteHeader() {
  const navigationItems = [
    { label: "Главная", href: "#" },
    { label: "Проекты", href: "#" },
    { label: "Партнеры", href: "#" },
    { label: "Кинорезерв", href: "#" },
    { label: "Новости", href: "#" },
    { label: <span className="flex items-center gap-1"><FaEnvelope /> Email</span>, href: "mailto:info@vtagency.ru" },
    { label: <span className="font-bold text-base">+7(922) 147 13-50</span> },
  ];

  const socialLinks = [
    { icon: <FaTelegram />, href: "https://t.me/VandTAgency" },
    { icon: <FaVk />, href: "https://vk.com/club230590987" },
    { icon: <FaYoutube />, href: "https://rutube.ru/channel/25381755/" },
  ];

  return (
    <header className="bg-white text-black py-4 px-6 border-b border-gray-300">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        {/* Logo Section */}
        <div className="mb-4 md:mb-0">
          <span className="text-2xl font-bold">V&T AGENCY</span>
        </div>

        {/* Navigation Section */}
        <nav className="flex flex-wrap gap-4 text-sm mb-4 md:mb-0">
          {navigationItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className="hover:text-gray-700 transition-colors whitespace-nowrap"
              // Отключаем href для номера телефона
              {...(item.href ? {} : { role: "text", tabIndex: -1 })}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Social Links Section */}
        <div className="flex gap-4 text-lg">
          {socialLinks.map((link, index) => (
            <a
              key={index}
              href={link.href}
              className="hover:text-gray-700 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.icon}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}