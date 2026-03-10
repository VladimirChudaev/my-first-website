'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import Editor from '@/components/admin/Editor';

export default function AdminContentCreatePage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [page, setPage] = useState('home'); 
  const [sectionKey, setSectionKey] = useState('awards_intro');
  const [body, setBody] = useState('');
  const [isVisible, setIsVisible] = useState(true);

  // Списки стандартных значений
  const standardPages = ['home', 'partners', 'projects', 'film-reserve'];
  const standardKeys = ['awards_intro', 'about_company', 'news_intro', 'header'];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/admin/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, page, section_key: sectionKey, body, is_visible: isVisible }),
    });

    if (res.ok) {
      toast.success('Запись создана');
      router.push('/admin/content');
      router.refresh();
    } else {
      toast.error('Ошибка при создании');
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Новый контент</h1>
        <Link href="/admin/content" className="text-sm underline text-gray-500">Назад к списку</Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 border rounded-2xl shadow-sm">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500 ml-1">Заголовок</label>
            <input 
              placeholder="Например: Наши партнеры" 
              className="w-full border rounded-xl px-4 py-2" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required 
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500 ml-1">Страница (page)</label>
            <select 
              className="w-full border rounded-xl px-4 py-2 bg-white mb-2"
              // Если текущей страницы нет в списке, ставим "custom"
              value={standardPages.includes(page) ? page : 'custom'}
              onChange={(e) => {
                const val = e.target.value;
                if (val === 'custom') {
                  setPage(''); // Очищаем, чтобы сработал рендер input ниже
                } else {
                  setPage(val);
                }
              }}
            >
              <option value="home">Главная (home)</option>
              <option value="partners">Партнеры (partners)</option>
              <option value="projects">Проекты (projects)</option>
              <option value="film-reserve">Резерв (film-reserve)</option>
              <option value="custom">-- Другая страница (вручную) --</option>
            </select>

            {/* Поле появляется, если page не входит в список standardPages */}
            {!standardPages.includes(page) && (
              <input 
                placeholder="Введите имя страницы вручную..." 
                className="w-full border rounded-xl px-4 py-2 bg-blue-50 border-blue-200 outline-none animate-in fade-in zoom-in duration-200"
                value={page}
                onChange={(e) => setPage(e.target.value)}
                required
              />
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500 ml-1">Ключ секции (section_key)</label>
            <select 
              className="w-full border rounded-xl px-4 py-2 bg-white mb-2"
              value={standardKeys.includes(sectionKey) ? sectionKey : 'custom'}
              onChange={(e) => {
                const val = e.target.value;
                if (val === 'custom') {
                  setSectionKey('');
                } else {
                  setSectionKey(val);
                }
              }}
            >
              <option value="awards_intro">Награды (awards_intro)</option>
              <option value="about_company">О компании (about_company)</option>
              <option value="news_intro">Новости (news_intro)</option>
              <option value="header">Шапка (header)</option>
              <option value="custom">-- Свой ключ (вручную) --</option>
            </select>

            {!standardKeys.includes(sectionKey) && (
              <input 
                placeholder="Введите ключ вручную..." 
                className="w-full border rounded-xl px-4 py-2 bg-blue-50 border-blue-200 outline-none animate-in fade-in zoom-in duration-200"
                value={sectionKey}
                onChange={(e) => setSectionKey(e.target.value)}
                required
              />
            )}
          </div>

          <div className="flex items-end pb-2">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input 
                type="checkbox" 
                className="w-4 h-4" 
                checked={isVisible} 
                onChange={(e) => setIsVisible(e.target.checked)} 
              /> 
              Видимость на сайте
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Контент (Body)</label>
          <Editor content={body} onChange={setBody} />
        </div>

        <button type="submit" className="px-8 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors">
          Создать запись
        </button>
      </form>
    </div>
  );
}