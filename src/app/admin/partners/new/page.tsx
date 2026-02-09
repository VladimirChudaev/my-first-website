'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PartnersService } from '@/lib/services/PartnersService';
import { mediaService } from '@/lib/services/MediaService';

export default function NewPartnerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    position: 0,
    is_visible: true
  });

  // Очистка ссылки на превью при размонтировании компонента для предотвращения утечек памяти
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreview(url);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert('Пожалуйста, выберите логотип');
      return;
    }

    setLoading(true);

    try {
      let mediaId = null;

      // Загрузка медиа через mediaService
      const uploadedMedia = await mediaService.upload(file, 'partner');
      mediaId = uploadedMedia.id;

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
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Новый партнёр</h1>
      
      <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 rounded-lg shadow-sm border">
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">Название организации</label>
          <input
            required
            placeholder="Введите название"
            className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">URL сайта (опционально)</label>
          <input
            type="url"
            placeholder="https://example.com"
            className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={formData.url}
            onChange={e => setFormData({ ...formData, url: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">Логотип партнёра</label>
          <div className="flex items-center gap-5">
            <div className="w-28 h-28 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden">
              {preview ? (
                <img src={preview} alt="Preview" className="object-contain w-full h-full p-2" />
              ) : (
                <span className="text-gray-400 text-xs text-center px-2">Логотип не выбран</span>
              )}
            </div>
            
            <label className="cursor-pointer bg-white border border-blue-600 text-blue-600 px-4 py-2 rounded-md font-bold hover:bg-blue-50 transition-colors">
              Выбрать файл
              <input
                type="file"
                accept="image/*"
                required
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="flex gap-6">
          <div className="w-32">
            <label className="block text-sm font-semibold mb-1 text-gray-700">Позиция</label>
            <input
              type="number"
              className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={formData.position}
              onChange={e => setFormData({ ...formData, position: parseInt(e.target.value) || 0 })}
            />
          </div>
          <div className="flex items-end pb-3">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                checked={formData.is_visible}
                onChange={e => setFormData({ ...formData, is_visible: e.target.checked })}
              />
              <span className="text-sm font-semibold text-gray-700 group-hover:text-black transition-colors">
                Виден на сайте
              </span>
            </label>
          </div>
        </div>

        <div className="pt-6 flex gap-3 border-t">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-8 py-2.5 rounded-md font-bold hover:bg-blue-700 disabled:opacity-50 transition-all shadow-sm"
          >
            {loading ? 'Создание...' : 'Создать партнёра'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-100 text-gray-600 px-8 py-2.5 rounded-md font-bold hover:bg-gray-200 transition-all"
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
}