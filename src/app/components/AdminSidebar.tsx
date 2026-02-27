'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
// Добавляем все иконки в импорт здесь:
import { 
  HiOutlineChevronLeft, 
  HiOutlineHome, 
  HiOutlineNewspaper,
  HiOutlineFilm,
  HiOutlineDocumentText,
  HiOutlineInbox,
  HiOutlinePhotograph,
  HiOutlineCollection
} from 'react-icons/hi';

const menuItems = [
  { title: 'Дашборд', href: '/admin', icon: HiOutlineHome },
  { title: 'Медиатека', href: '/admin/media', icon: HiOutlinePhotograph },
  { title: 'Карусель (Главная)', href: '/admin/home-carousel', icon: HiOutlineCollection },
  { title: 'Новости', href: '/admin/news', icon: HiOutlineNewspaper },
  { title: 'Проекты', href: '/admin/pages/projects', icon: HiOutlineFilm },
  { title: 'Страницы / Тексты', href: '/admin/content', icon: HiOutlineDocumentText },
  { title: 'Заявки (Резерв)', href: '/admin/pages/film-reserve', icon: HiOutlineInbox },
];

export default function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside className={`${isCollapsed ? 'w-20' : 'w-64'} transition-all duration-300 bg-slate-900 min-h-screen text-white flex flex-col sticky top-0`}>
      <div className="p-4 flex justify-between items-center border-b border-slate-800">
        {!isCollapsed && <span className="font-bold text-xs tracking-widest uppercase text-slate-400">Панель управления</span>}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-slate-800 rounded-lg transition-colors mx-auto"
        >
          <HiOutlineChevronLeft className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>

      <nav className="flex-grow p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          const Icon = item.icon;
          
          return (
            <a
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 p-3 rounded-lg transition-all ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={22} className="shrink-0" />
              {!isCollapsed && <span className="text-sm font-medium">{item.title}</span>}
            </a>
          );
        })}
      </nav>

      {!isCollapsed && (
        <div className="p-4 border-t border-slate-800">
          <div className="text-[10px] text-slate-500 uppercase tracking-tighter text-center">
            v2.0 Beta • 2026
          </div>
        </div>
      )}
    </aside>
  );
}