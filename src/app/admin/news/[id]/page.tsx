'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function AdminNewsEditPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = use(paramsPromise);
  const router = useRouter();
  const supabase = createClient();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [body, setBody] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/news/${params.id}`)
      .then(res => res.json())
      .then(res => {
        const item = res.data;
        setTitle(item.title);
        setSlug(item.slug);
        setBody(item.body || '');
        setImageUrl(item.cover_image_url || '');
        setIsVisible(item.is_visible);
        setLoading(false);
      });
  }, [params.id]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fileName = `${Date.now()}-${file.name}`;
    const { data } = await supabase.storage.from('news').upload(fileName, file);
    if (data) {
      const { data: { publicUrl } } = supabase.storage.from('news').getPublicUrl(data.path);
      setImageUrl(publicUrl);
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await fetch(`/api/admin/news/${params.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ title, slug, body, is_visible: isVisible, cover_image_url: imageUrl }),
    });
    router.push('/admin/news');
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm('Delete?')) return;
    await fetch(`/api/admin/news/${params.id}`, { method: 'DELETE' });
    router.push('/admin/news');
    router.refresh();
  }

  if (loading) return <p className="p-8">Loading...</p>;

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-semibold">Edit news</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 border rounded">
        <input className="w-full border rounded px-3 py-2 font-medium" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
        <input className="w-full border rounded px-3 py-2 bg-gray-50 text-sm" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="Slug" />
        <div>
          <input type="file" onChange={handleUpload} className="mb-2 text-sm" />
          {imageUrl && <img src={imageUrl} className="h-32 w-full object-cover rounded border" />}
        </div>
        <textarea className="w-full border rounded px-3 py-2 min-h-[200px]" value={body} onChange={(e) => setBody(e.target.value)} />
        <label className="flex items-center gap-2"><input type="checkbox" checked={isVisible} onChange={(e) => setIsVisible(e.target.checked)} /> Visible</label>
        <div className="flex gap-3">
          <button type="submit" className="px-4 py-2 bg-black text-white rounded text-sm">Save</button>
          <button type="button" onClick={handleDelete} className="px-4 py-2 border rounded text-sm text-red-600">Delete</button>
        </div>
      </form>
    </div>
  );
}