'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import Editor from '@/components/admin/Editor';

export default function AdminContentCreatePage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [page, setPage] = useState('partners'); // По умолчанию для твоей задачи
  const [sectionKey, setSectionKey] = useState('header');
  const [body, setBody] = useState('');
  const [isVisible, setIsVisible] = useState(true);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/admin/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        title, 
        page, 
        section_key: sectionKey, 
        body, 
        is_visible: isVisible 
      }),
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
        <Link href="/admin/content" className="text-sm underline">Назад к списку</Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 border rounded-2xl shadow-sm">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500 ml-1">Заголовок</label>
            <input placeholder="Например: Наши партнеры" className="w-full border rounded-xl px-4 py-2" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500 ml-1">Страница (page)</label>
            <input placeholder="partners, home..." className="w-full border rounded-xl px-4 py-2" value={page} onChange={(e) => setPage(e.target.value)} required />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500 ml-1">Ключ секции (section_key)</label>
            <input placeholder="header, intro, about..." className="w-full border rounded-xl px-4 py-2" value={sectionKey} onChange={(e) => setSectionKey(e.target.value)} required />
          </div>
          <div className="flex items-end pb-2">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" className="w-4 h-4" checked={isVisible} onChange={(e) => setIsVisible(e.target.checked)} /> 
              Видимость на сайте
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Контент (Body)</label>
          <Editor content={body} onChange={setBody} />
        </div>

        <button className="px-8 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors">
          Создать запись
        </button>
      </form>
    </div>
  );
}