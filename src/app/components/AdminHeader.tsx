'use client';

import { usePathname } from 'next/navigation';
import { HiOutlineExternalLink } from 'react-icons/hi';

export default function AdminHeader() {
  const pathname = usePathname();

  // Архитектурно верная проверка: мы смотрим на актуальный URL в браузере
  const isFilmReserve = pathname === '/admin/pages/film-reserve';

  return (
    <header className="h-14 border-b bg-white flex items-center justify-between px-6 sticky top-0 z-40 shadow-sm">
      <div className="flex items-center gap-4">
        <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest border-r pr-4 border-gray-200">
          CMS v2.0
        </span>
        <h2 className="text-slate-900 text-xs font-bold uppercase tracking-tighter">
          {/* Если путь совпадает с новым адресом — меняем заголовок */}
          {isFilmReserve ? 'Редактор: Кинорезерв' : 'Панель управления'}
        </h2>
      </div>
      
      <div className="flex items-center gap-3">
        <a 
          href="/" 
          target="_blank"
          className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-md text-[10px] font-black border border-slate-200 uppercase transition-all"
        >
          На сайт <HiOutlineExternalLink size={14} className="text-blue-600" />
        </a>

        <div className="h-6 w-[1px] bg-gray-200 mx-1" />

        <div className="flex items-center gap-3 pl-2">
          <div className="text-right">
            <div className="text-[11px] font-black text-slate-900 leading-none uppercase tracking-tighter">
              Администратор
            </div>
            <div className="text-[9px] text-green-500 font-bold leading-none mt-1 flex items-center justify-end gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              ONLINE
            </div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center text-white text-[11px] font-black uppercase">
            AD
          </div>
        </div>
      </div>
    </header>
  );
}