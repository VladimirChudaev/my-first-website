'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import Editor from '@/components/admin/Editor';

export default function AdminContentCreatePage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [body, setBody] = useState('');
  const [scope, setScope] = useState<'global' | 'page'>('page');
  const [isVisible, setIsVisible] = useState(true);
  const [coverImageId, setCoverImageId] = useState<string | null>(null);
  const [mediaList, setMediaList] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/admin/media').then(res => res.json()).then(res => setMediaList(res.data || []));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/admin/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, slug, body, scope, is_visible: isVisible, cover_image_id: coverImageId }),
    });

    if (res.ok) {
      toast.success('Страница создана');
      router.push('/admin/content');
      router.refresh();
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Новый контент</h1>
        <Link href="/admin/content" className="text-sm underline">Назад к списку</Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 border rounded-2xl">
        <div className="grid grid-cols-2 gap-4">
          <input placeholder="Заголовок" className="border rounded-xl px-4 py-2" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <input placeholder="Slug (url)" className="border rounded-xl px-4 py-2" value={slug} onChange={(e) => setSlug(e.target.value)} required />
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium">Обложка страницы</p>
          <div className="grid grid-cols-6 gap-2 max-h-[200px] overflow-y-auto p-2 border rounded-xl">
            {mediaList.map((media) => (
              <div key={media.id} onClick={() => setCoverImageId(media.id)} className={`relative cursor-pointer aspect-square rounded-lg overflow-hidden border-2 ${coverImageId === media.id ? 'border-black' : 'border-transparent'}`}>
                <img src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${media.bucket}/${media.path}`} className="object-cover h-full w-full" />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Контент</label>
          <Editor content={body} onChange={setBody} />
        </div>

        <div className="flex items-center gap-6">
          <select className="border rounded-xl px-4 py-2" value={scope} onChange={(e) => setScope(e.target.value as any)}>
            <option value="page">Страница</option>
            <option value="global">Глобальный блок</option>
          </select>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={isVisible} onChange={(e) => setIsVisible(e.target.checked)} /> Видимость</label>
        </div>

        <button className="px-8 py-3 bg-black text-white rounded-xl font-medium">Создать</button>
      </form>
    </div>
  );
}