'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function AdminNewsCreatePage() {
  const router = useRouter();
  const supabase = createClient();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [body, setBody] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [loading, setLoading] = useState(false);

  // Авто-слаг при изменении заголовка
  const handleTitleChange = (val: string) => {
    setTitle(val);
    setSlug(val.toLowerCase().replace(/[^\w\sа-яё]/gi, '').replace(/\s+/g, '-'));
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);

    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage.from('news').upload(fileName, file);

    if (error) {
      alert('Upload error');
    } else {
      const { data: { publicUrl } } = supabase.storage.from('news').getPublicUrl(data.path);
      setImageUrl(publicUrl);
    }
    setLoading(false);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/admin/news', {
      method: 'POST',
      body: JSON.stringify({ title, slug, body, is_visible: isVisible, cover_image_url: imageUrl }),
    });
    router.push('/admin/news');
    router.refresh();
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">New news</h1>
        <Link href="/admin/news" className="text-sm underline">Back</Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded border">
        <div>
          <label className="block text-sm mb-1 font-medium">Title</label>
          <input className="w-full border rounded px-3 py-2" value={title} onChange={(e) => handleTitleChange(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm mb-1 font-medium">Slug</label>
          <input className="w-full border rounded px-3 py-2 bg-gray-50" value={slug} onChange={(e) => setSlug(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm mb-1 font-medium">Cover Image</label>
          <input type="file" onChange={handleUpload} className="mb-2 block text-sm" />
          {imageUrl && <img src={imageUrl} className="h-32 w-full object-cover rounded border" />}
        </div>
        <div>
          <label className="block text-sm mb-1 font-medium">Body</label>
          <textarea className="w-full border rounded px-3 py-2 min-h-[150px]" value={body} onChange={(e) => setBody(e.target.value)} />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={isVisible} onChange={(e) => setIsVisible(e.target.checked)} /> Visible
        </label>
        <button type="submit" disabled={loading} className="px-4 py-2 rounded bg-black text-white text-sm disabled:opacity-50">
          {loading ? 'Processing...' : 'Create'}
        </button>
      </form>
    </div>
  );
}