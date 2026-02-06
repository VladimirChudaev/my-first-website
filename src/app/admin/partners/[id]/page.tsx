'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { PartnersService, PartnerDTO } from '@/lib/services/PartnersService';
import { MediaService } from '@/lib/services/MediaService';

export default function EditPartnerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<PartnerDTO | null>(null);

  useEffect(() => {
    const loadPartner = async () => {
      try {
        const allPartners = await PartnersService.getAll();
        const partner = allPartners.find(p => p.id === id);
        
        if (!partner) {
          alert('Партнёр не найден');
          router.push('/admin/partners');
          return;
        }
        setFormData(partner);
      } catch (err) {
        console.error('Failed to load partner:', err);
      } finally {
        setLoading(false);
      }
    };
    loadPartner();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    
    setSaving(true);
    try {
      let mediaId = formData.id; // сохраняем текущий, если файл не меняли

      if (file) {
        const uploadedMedia = await MediaService.upload(file, 'partner');
        mediaId = uploadedMedia.id;
      }

      await PartnersService.update(id, {
        name: formData.name,
        url: formData.url,
        position: formData.position,
        is_visible: formData.is_visible,
        media_id: file ? mediaId : undefined // обновляем ID медиа только если загружен новый файл
      });

      router.push('/admin/partners');
      router.refresh();
    } catch (err) {
      console.error(err);
      alert('Ошибка при сохранении');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !formData) return <div className="p-8">Загрузка данных...</div>;

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Редактировать партнёра</h1>
      
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
            value={formData.url || ''}
            onChange={e => setFormData({ ...formData, url: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Текущий логотип</label>
          <div className="mb-2 w-24 h-24 border rounded bg-gray-50 flex items-center justify-center overflow-hidden">
            <img 
              src={formData.imageUrl || '/placeholder.png'} 
              alt="Preview" 
              className="object-contain w-full h-full"
            />
          </div>
          <label className="block text-sm font-medium mb-1 text-blue-600">Заменить логотип</label>
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
              onChange={e => setFormData({ ...formData, position: parseInt(e.target.value) || 0 })}
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
            disabled={saving}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Сохранение...' : 'Сохранить изменения'}
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