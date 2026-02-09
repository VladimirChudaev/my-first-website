'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { HiOutlineChevronLeft, HiOutlineHome, HiOutlineUsers, HiOutlineViewGrid, HiOutlineNewspaper } from 'react-icons/hi';

const menuItems = [
  { title: 'Главная', href: '/admin', icon: HiOutlineHome },
  { title: 'Партнеры', href: '/admin/partners', icon: HiOutlineUsers },
  { title: 'Медиа', href: '/admin/media', icon: HiOutlineViewGrid },
  { title: 'Новости', href: '/admin/news', icon: HiOutlineNewspaper },
];

export default function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside className={`${isCollapsed ? 'w-20' : 'w-64'} transition-all duration-300 bg-slate-900 min-h-screen text-white flex flex-col sticky top-0`}>
      {/* Кнопка свернуть/развернуть */}
      <div className="p-4 flex justify-between items-center border-b border-slate-800">
        {!isCollapsed && <span className="font-bold text-sm tracking-widest uppercase">Админка</span>}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-slate-800 rounded-lg transition-colors mx-auto"
        >
          <HiOutlineChevronLeft className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Список ссылок */}
      <nav className="flex-grow p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <a
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 p-3 rounded-lg transition-all ${
                isActive ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={22} className="shrink-0" />
              {!isCollapsed && <span className="text-sm font-medium">{item.title}</span>}
            </a>
          );
        })}
      </nav>
    </aside>
  );
}