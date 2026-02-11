'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState, use } from 'react';
import { createClient } from '@/lib/client';

type Props = {
  params: Promise<{ id: string }>;
};

export default function AdminMediaEditPage({ params }: Props) {
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
    is_visible: true,
    filename: '' // Храним имя текущего файла
  });

  useEffect(() => {
    async function loadMedia() {
      const { data } = await supabase
        .from('media')
        .select('*')
        .eq('id', id)
        .single();

      if (data) {
        setFormData({
          title: data.title || '',
          description: data.description || '',
          credits: data.credits || '',
          is_visible: data.is_visible ?? true,
          filename: data.filename || ''
        });

        // Получаем текущее изображение для превью
        if (data.filename) {
          const { data: { publicUrl } } = supabase.storage
            .from('media')
            .getPublicUrl(data.filename);
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

    let currentFilename = formData.filename;

    // 1. Если выбран новый файл, загружаем его
    if (file) {
      const fileExt = file.name.split('.').pop();
      const newFilename = `${Math.random()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(newFilename, file);

      if (uploadError) {
        alert('Error uploading image: ' + uploadError.message);
        setSaving(false);
        return;
      }
      currentFilename = newFilename;
    }

    // 2. Обновляем данные в таблице
    const { error } = await supabase
      .from('media')
      .update({
        title: formData.title,
        description: formData.description,
        credits: formData.credits,
        is_visible: formData.is_visible,
        filename: currentFilename // Сохраняем имя файла
      })
      .eq('id', id);

    setSaving(false);
    if (!error) {
      router.push('/admin/media');
      router.refresh();
    } else {
      alert('Error saving: ' + error.message);
    }
  }

  if (loading) return <div className="pt-24 px-8 text-gray-500 font-medium">Loading...</div>;

  return (
    <div className="pt-24 px-8 pb-12 max-w-4xl space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Edit Media Item</h1>
          <p className="text-sm text-gray-400 font-mono mt-1">ID: {id}</p>
        </div>
        <Link href="/admin/media" className="text-sm font-medium text-blue-600 hover:text-blue-800">
          ← Back to Library
        </Link>
      </div>

      <form onSubmit={handleSave} className="bg-white border rounded-xl p-8 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Project Title</label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Credits (Director, DOP)</label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.credits}
              onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
            />
          </div>
        </div>

        {/* НОВЫЙ БЛОК: Загрузка изображения */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Project Image</label>
          <div className="flex items-center gap-4 p-4 border rounded-lg bg-gray-50">
            {previewUrl && (
              <img src={previewUrl} alt="Preview" className="w-20 h-20 object-cover rounded border" />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const selectedFile = e.target.files?.[0];
                if (selectedFile) {
                  setFile(selectedFile);
                  setPreviewUrl(URL.createObjectURL(selectedFile));
                }
              }}
              className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Description</label>
          <textarea
            rows={4}
            className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border">
          <input
            type="checkbox"
            id="visible"
            className="w-4 h-4 cursor-pointer"
            checked={formData.is_visible}
            onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })}
          />
          <label htmlFor="visible" className="text-sm font-medium cursor-pointer">
            Publicly visible on website
          </label>
        </div>

        <div className="pt-6 flex items-center justify-between border-t">
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-all"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2.5 bg-gray-100 text-gray-600 font-medium rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}