'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import Editor from '@/components/admin/Editor';

export default function AdminContentEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [title, setTitle] = useState('');
  const [page, setPage] = useState('');
  const [sectionKey, setSectionKey] = useState('');
  const [body, setBody] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/content/${id}`)
      .then(res => res.json())
      .then(res => {
        const d = res.data;
        if (d) {
          setTitle(d.title || '');
          setPage(d.page || '');
          setSectionKey(d.section_key || '');
          setBody(d.body || '');
          setIsVisible(d.is_visible);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch(`/api/admin/content/${id}`, {
      method: 'PATCH',
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
      toast.success('Обновлено успешно');
      router.push('/admin/content');
      router.refresh();
    }
  }

  if (loading) return <div className="p-10 text-center text-gray-500">Загрузка данных...</div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Редактировать текст</h1>
        <Link href="/admin/content" className="text-sm text-gray-500 hover:underline">← Назад к списку</Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 border rounded-2xl shadow-sm">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-400 uppercase ml-1">Заголовок</label>
            <input className="w-full border rounded-xl px-4 py-2 font-medium" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-1 text-gray-400 cursor-not-allowed">
            <label className="text-xs font-medium uppercase ml-1">Место (Page / Key)</label>
            <div className="px-4 py-2 bg-gray-50 border rounded-xl text-sm">
              {page} / {sectionKey}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Контент страницы</label>
          <Editor content={body} onChange={setBody} />
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex gap-4">
            <button className="px-10 py-2 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors">
              Сохранить
            </button>
            <button type="button" onClick={async () => { 
              if(confirm('Удалить эту текстовую секцию?')) { 
                await fetch(`/api/admin/content/${id}`, { method: 'DELETE' });
                router.push('/admin/content');
              }
            }} className="px-6 py-2 border border-red-100 rounded-xl text-red-500 hover:bg-red-50 transition-colors">
              Удалить
            </button>
          </div>
          
          <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
            <input type="checkbox" className="w-4 h-4" checked={isVisible} onChange={(e) => setIsVisible(e.target.checked)} /> 
            Отображать на сайте
          </label>
        </div>
      </form>
    </div>
  );
}