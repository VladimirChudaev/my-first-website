'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState, use } from 'react';
import { createClient } from '@/lib/client';

export default function AdminMediaEditPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const supabase = createClient();
  const { id } = use(params);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    credits: '',
    alt_text: '',
    link: '',
    is_visible: true,
    filename: '' 
  });

  useEffect(() => {
    async function loadMedia() {
      const { data } = await supabase.from('media').select('*').eq('id', id).single();
      if (data) {
        setFormData({
          title: data.title || '',
          description: data.description || '',
          credits: data.credits || '',
          alt_text: data.alt_text || '',
          link: data.link || '',
          is_visible: data.is_visible ?? true,
          filename: data.filename || ''
        });
        if (data.filename) {
          const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(data.filename);
          setPreviewUrl(publicUrl);
        }
      }
      setLoading(false);
    }
    loadMedia();
  }, [id, supabase]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      let currentFilename = formData.filename;
      if (file) {
        const fileExt = file.name.split('.').pop();
        const newFilename = `${Math.random()}.${fileExt}`;
        const { error: upErr } = await supabase.storage.from('media').upload(newFilename, file);
        if (upErr) throw upErr;
        currentFilename = newFilename;
      }

      const response = await fetch('/api/admin/media', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...formData, filename: currentFilename }),
        cache: 'no-store',
      });

      if (!response.ok) throw new Error('Ошибка сохранения');

      router.push('/admin/media');
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="p-10 font-bold">ЗАГРУЗКА...</div>;

  return (
    <div className="pt-24 px-8 pb-12 max-w-4xl mx-auto">
      <div className="flex justify-between border-b-2 pb-4 mb-8">
        <h1 className="text-2xl font-black uppercase">Редактировать проект</h1>
        <Link href="/admin/media" className="text-blue-600 font-bold">← НАЗАД</Link>
      </div>

      <form onSubmit={handleSave} className="bg-white border p-8 rounded-3xl shadow-xl space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <input
            className="p-4 bg-gray-50 rounded-xl outline-none border-2 focus:border-blue-500"
            placeholder="Название проекта"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <input
            className="p-4 bg-gray-50 rounded-xl outline-none border-2 focus:border-blue-500"
            placeholder="Создатели"
            value={formData.credits}
            onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-6 p-6 bg-blue-50 rounded-2xl">
          <input
            className="p-4 bg-white rounded-xl outline-none border-2 focus:border-blue-500 font-bold"
            placeholder="Номинация (alt_text)"
            value={formData.alt_text}
            onChange={(e) => setFormData({ ...formData, alt_text: e.target.value })}
          />
          <input
            className="p-4 bg-white rounded-xl outline-none border-2 focus:border-blue-500 font-bold"
            placeholder="Фестиваль (link)"
            value={formData.link}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-black uppercase text-gray-400">Описание (SEO)</label>
          <textarea
            rows={4}
            className="p-4 bg-gray-50 rounded-xl outline-none border-2 focus:border-blue-500 resize-none"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all uppercase"
        >
          {saving ? 'СОХРАНЕНИЕ...' : 'СОХРАНИТЬ ИЗМЕНЕНИЯ'}
        </button>
      </form>
    </div>
  );
}