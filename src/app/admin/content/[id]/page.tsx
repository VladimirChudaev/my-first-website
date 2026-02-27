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
  const [slug, setSlug] = useState('');
  const [body, setBody] = useState('');
  const [scope, setScope] = useState<'global' | 'page'>('page');
  const [isVisible, setIsVisible] = useState(true);
  const [coverImageId, setCoverImageId] = useState<string | null>(null);
  const [mediaList, setMediaList] = useState<any[]>([]);

  useEffect(() => {
    // Загружаем данные страницы
    fetch(`/api/admin/content/${id}`).then(res => res.json()).then(res => {
      const d = res.data;
      if (d) {
        setTitle(d.title || '');
        setSlug(d.slug || '');
        setBody(d.body || '');
        setScope(d.scope || 'page');
        setIsVisible(d.is_visible);
        setCoverImageId(d.cover_image_id);
      }
    });
    // Загружаем медиатеку
    fetch('/api/admin/media').then(res => res.json()).then(res => setMediaList(res.data || []));
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch(`/api/admin/content/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, slug, body, scope, is_visible: isVisible, cover_image_id: coverImageId }),
    });

    if (res.ok) {
      toast.success('Обновлено');
      router.push('/admin/content');
      router.refresh();
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Редактировать контент</h1>
        <Link href="/admin/content" className="text-sm underline">Назад</Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 border rounded-2xl shadow-sm">
        <div className="grid grid-cols-2 gap-4">
          <input className="border rounded-xl px-4 py-2" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Заголовок" />
          <input className="border rounded-xl px-4 py-2 text-gray-400" value={slug} readOnly />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Контент страницы</label>
          <Editor content={body} onChange={setBody} />
        </div>

        <div className="grid grid-cols-6 gap-2 max-h-[200px] overflow-y-auto p-2 border rounded-xl">
           {mediaList.map((media) => (
              <div key={media.id} onClick={() => setCoverImageId(media.id)} className={`relative cursor-pointer aspect-square rounded-lg overflow-hidden border-2 ${coverImageId === media.id ? 'border-black' : 'border-transparent'}`}>
                <img src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${media.bucket}/${media.path}`} className="object-cover h-full w-full" />
              </div>
            ))}
        </div>

        <div className="flex gap-4">
          <button className="px-8 py-2 bg-black text-white rounded-xl">Сохранить</button>
          <button type="button" onClick={async () => { 
            if(confirm('Удалить?')) { 
              await fetch(`/api/admin/content/${id}`, { method: 'DELETE' });
              router.push('/admin/content');
            }
          }} className="px-8 py-2 border rounded-xl text-red-500">Удалить</button>
        </div>
      </form>
    </div>
  );
}