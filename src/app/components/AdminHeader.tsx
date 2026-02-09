'use client';

import { HiOutlineExternalLink } from 'react-icons/hi';

export default function AdminHeader() {
  return (
    <header className="h-14 border-b bg-white flex items-center justify-end px-6 sticky top-0 z-40 shadow-sm">
      <a 
        href="/" 
        className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-md text-[10px] font-black border uppercase transition-all"
      >
        На сайт <HiOutlineExternalLink size={14} />
      </a>
      <div className="ml-4 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-black shadow-inner">
        AD
      </div>
    </header>
  );
}