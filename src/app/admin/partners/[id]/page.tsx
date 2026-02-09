'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { PartnersService, PartnerDTO } from '@/lib/services/PartnersService';
import { mediaService } from '@/lib/services/MediaService';

export default function EditPartnerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null); // Для превью нового файла
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

  // Обработка выбора файла
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    
    setSaving(true);
    try {
      let currentMediaId = formData.media_id;

      if (file) {
        // Загрузка нового логотипа
        const uploadedMedia = await mediaService.upload(file, 'partner');
        currentMediaId = uploadedMedia.id;
      }

      await PartnersService.update(id, {
        name: formData.name,
        url: formData.url,
        position: formData.position,
        is_visible: formData.is_visible,
        media_id: currentMediaId
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
          <label className="block text-sm font-medium mb-1 text-gray-700">Название организации</label>
          <input
            required
            className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">URL сайта</label>
          <input
            type="url"
            className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            value={formData.url || ''}
            onChange={e => setFormData({ ...formData, url: e.target.value })}
            placeholder="https://example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Логотип</label>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-24 h-24 border-2 border-dashed rounded bg-gray-50 flex items-center justify-center overflow-hidden">
              <img 
                src={preview || formData.imageUrl || '/placeholder.png'} 
                alt="Preview" 
                className="object-contain w-full h-full p-1"
              />
            </div>
            
            <label className="bg-white border border-blue-600 text-blue-600 px-4 py-2 rounded font-bold cursor-pointer hover:bg-blue-50 transition-colors">
              Выбрать новый файл
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
          {file && <span className="text-xs text-green-600 block">Новый файл подготовлен: {file.name}</span>}
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1 text-gray-700">Порядок (позиция)</label>
            <input
              type="number"
              className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
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
              <span className="text-sm font-medium text-gray-700 group-hover:text-black">Отображать на сайте</span>
            </label>
          </div>
        </div>

        <div className="pt-6 flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white px-8 py-2.5 rounded font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
          >
            {saving ? 'Сохранение...' : 'Сохранить'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-100 text-gray-700 px-8 py-2.5 rounded font-bold hover:bg-gray-200 transition-colors"
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
}