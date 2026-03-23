'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Save, ImageIcon, Link as LinkIcon, LayoutList } from 'lucide-react';
import { createClient } from '@/lib/client';
import { insertVideoProject } from '@/lib/video-projects/video-projects.supabase';

export default function NewVideoProjectPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    media_id: '',
    url: '',
    title: '',
    is_visible: true,
    position: 0
  });

  // Загружаем список доступных изображений из медиатеки
  useEffect(() => {
    async function loadMedia() {
      const { data } = await supabase
        .from('media')
        .select('id, title, filename')
        .order('created_at', { ascending: false });
      
      if (data) setMediaList(data);
    }
    loadMedia();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!formData.media_id) {
      alert('Пожалуйста, выберите изображение для обложки');
      return;
    }

    setLoading(true);
    try {
      const { error } = await insertVideoProject(formData);
      if (error) throw error;
      
      router.push('/admin/video-projects');
      router.refresh();
    } catch (err: any) {
      alert('Ошибка при сохранении элемента: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Link 
        href="/admin/video-projects" 
        className="flex items-center text-slate-500 hover:text-slate-800 mb-6 transition-colors group"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
        <span className="ml-1">Вернуться к списку проектов</span>
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
          <LayoutList size={24} />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Новый элемент карусели</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        
        {/* Выбор обложки */}
        <div>
          <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">
            Обложка (заглушка)
          </label>
          <div className="relative">
            <select
              required
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none appearance-none transition-all pr-10"
              value={formData.media_id}
              onChange={(e) => setFormData({ ...formData, media_id: e.target.value })}
            >
              <option value="">-- Выберите фото из медиатеки --</option>
              {mediaList.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title || item.filename}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-3.5 pointer-events-none text-slate-400">
              <ImageIcon size={18} />
            </div>
          </div>
          <p className="mt-2 text-[11px] text-slate-400 italic">
            * Если нужного кадра нет в списке, сначала добавьте его в раздел "Media".
          </p>
        </div>

        {/* Название для внутреннего учета */}
        <div>
          <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">
            Техническое название
          </label>
          <input
            type="text"
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            placeholder="Напр: Проект 'Тишина' - Обложка 1"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        {/* Ссылка на внешний ресурс */}
        <div>
          <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">
            Ссылка на видео (Rutube / YouTube)
          </label>
          <div className="relative">
            <input
              type="url"
              required
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all pr-10"
              placeholder="https://rutube.ru/video/..."
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            />
            <div className="absolute right-3 top-3.5 pointer-events-none text-slate-400">
              <LinkIcon size={18} />
            </div>
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 bg-slate-900 text-white rounded-lg font-bold shadow-md hover:bg-blue-600 transition-all flex items-center justify-center gap-2 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              'Сохранение...'
            ) : (
              <>
                <Save size={18} /> Опубликовать проект
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}