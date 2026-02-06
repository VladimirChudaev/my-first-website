'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PartnersService } from '@/lib/services/PartnersService';
import { MediaService } from '@/lib/services/MediaService';

export default function NewPartnerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    position: 0,
    is_visible: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let mediaId = null;

      if (file) {
        // Загрузка через MediaService с принудительной категорией 'partner'
        const uploadedMedia = await MediaService.upload(file, 'partner');
        mediaId = uploadedMedia.id;
      }

      await PartnersService.create({
        ...formData,
        media_id: mediaId
      });

      router.push('/admin/partners');
      router.refresh();
    } catch (err) {
      console.error(err);
      alert('Ошибка при создании партнёра');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Новый партнёр</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
        <div>
          <label className="block text-sm font-medium mb-1">Название</label>
          <input
            required
            className="w-full border rounded p-2"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">URL сайта</label>
          <input
            type="url"
            className="w-full border rounded p-2"
            value={formData.url}
            onChange={e => setFormData({ ...formData, url: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Логотип</label>
          <input
            type="file"
            accept="image/*"
            onChange={e => setFile(e.target.files?.[0] || null)}
            className="w-full"
          />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Позиция</label>
            <input
              type="number"
              className="w-full border rounded p-2"
              value={formData.position}
              onChange={e => setFormData({ ...formData, position: parseInt(e.target.value) })}
            />
          </div>
          <div className="flex items-end pb-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_visible}
                onChange={e => setFormData({ ...formData, is_visible: e.target.checked })}
              />
              <span className="text-sm font-medium">Виден на сайте</span>
            </label>
          </div>
        </div>
        <div className="pt-4 flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Сохранение...' : 'Создать'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-100 px-6 py-2 rounded hover:bg-gray-200"
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
}