'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Editor from '@/components/admin/Editor';

export default function AdminNewsEditPage({
  params: paramsPromise,
}: {
  params: Promise<{ id: string }>;
}) {
  const params = use(paramsPromise);
  const router = useRouter();

  // Состояния формы
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [body, setBody] = useState('');
  const [coverImageId, setCoverImageId] = useState<string | null>(null);
  const [createdAt, setCreatedAt] = useState(''); // Новое состояние для даты
  const [isVisible, setIsVisible] = useState(true);
  
  // Состояния загрузки
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Загружаем данные новости
    fetch(`/api/admin/news/${params.id}`)
      .then((res) => res.json())
      .then((res) => {
        const item = res.data;
        setTitle(item.title);
        setSlug(item.slug);
        setBody(item.body || '');
        setCoverImageId(item.cover_image_id || null);
        setIsVisible(item.is_visible);
        // Форматируем дату из базы для инпута datetime-local
        if (item.created_at) {
          setCreatedAt(new Date(item.created_at).toISOString().slice(0, 16));
        }
        setLoading(false);
      });

    // Загружаем медиатеку
    fetch(`/api/admin/media?category=photo`)
      .then((res) => res.json())
      .then((res) => setMediaList(res.data || []));
  }, [params.id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`/api/admin/news/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          body,
          is_visible: isVisible,
          cover_image_id: coverImageId,
          created_at: createdAt, // Отправляем измененную дату
        }),
      });

      if (res.ok) {
        toast.success('Обновлено');
        router.push('/admin/news');
        router.refresh();
      }
    } catch (err) {
      toast.error('Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="p-8 animate-pulse text-gray-400">Загрузка данных...</div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Редактирование новости</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 border rounded-2xl shadow-sm">
        <div className="grid gap-4">
          <input
            className="w-full border rounded-xl px-4 py-3 font-medium focus:ring-2 ring-black outline-none transition-all"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Заголовок"
          />

          <input
            className="w-full border rounded-xl px-4 py-2 bg-gray-50 text-sm text-gray-500 outline-none"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="Slug"
          />
        </div>

        {/* ПОЛЕ ДАТЫ */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider px-1">Дата публикации</label>
          <input 
            type="datetime-local" 
            value={createdAt}
            onChange={(e) => setCreatedAt(e.target.value)}
            className="w-full border rounded-xl px-4 py-3 focus:ring-2 ring-black outline-none transition-all"
          />
        </div>

        {/* MEDIA PICKER */}
        <div className="space-y-3">
          <p className="text-sm font-medium px-1">Обложка новости</p>
          <div className="grid grid-cols-4 md:grid-cols-6 gap-3 max-h-[300px] overflow-y-auto p-1 border rounded-xl">
            {mediaList.map((media) => {
              const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${media.bucket}/${media.path}`;

              return (
                <div
                  key={media.id}
                  onClick={() => setCoverImageId(media.id)}
                  className={`relative cursor-pointer aspect-square border-2 rounded-xl overflow-hidden transition-all ${
                    coverImageId === media.id
                      ? 'border-black ring-2 ring-black/10'
                      : 'border-transparent hover:border-gray-200'
                  }`}
                >
                  <img
                    src={url}
                    className={`h-full w-full object-cover transition-transform ${coverImageId === media.id ? 'scale-105' : ''}`}
                    alt=""
                  />
                  {coverImageId === media.id && (
                    <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                      <div className="bg-black text-white rounded-full p-1">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium px-1">Текст новости</label>
          <Editor content={body} onChange={setBody} />
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black cursor-pointer"
              checked={isVisible}
              onChange={(e) => setIsVisible(e.target.checked)}
            />
            <span className="text-sm font-medium text-gray-700 group-hover:text-black transition-colors">Опубликовано на сайте</span>
          </label>

          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-black text-white rounded-xl hover:bg-gray-800 disabled:bg-gray-400 transition-colors font-medium"
          >
            {saving ? 'Сохранение...' : 'Сохранить изменения'}
          </button>
        </div>
      </form>
    </div>
  );
}