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

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [body, setBody] = useState('');
  const [coverImageId, setCoverImageId] = useState<string | null>(null);
  const [createdAt, setCreatedAt] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/news/${params.id}`)
      .then((res) => res.json())
      .then((res) => {
        const item = res.data;
        setTitle(item.title);
        setSlug(item.slug);
        setBody(item.body || '');
        setCoverImageId(item.cover_image_id || null);
        setIsVisible(item.is_visible);
        if (item.created_at) {
          setCreatedAt(new Date(item.created_at).toISOString().slice(0, 16));
        }
        setLoading(false);
      });

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
          created_at: createdAt,
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

  if (loading) return <div className="p-8 animate-pulse text-slate-500 text-center font-medium">Загрузка данных...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10 px-4">
      {/* Шапка страницы */}
      <div className="flex items-center justify-between py-2 border-b border-slate-200">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Редактирование</h1>
        <button 
          onClick={() => router.back()}
          className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
        >
          Назад к списку
        </button>
      </div>

      {/* Форма на белом фоне */}
      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 md:p-10 border border-slate-100 rounded-3xl shadow-xl">
        
        {/* Заголовок и Slug */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-sm font-bold uppercase tracking-wider text-slate-900 ml-1">Заголовок</label>
            <input
              className="w-full bg-white border border-slate-300 rounded-xl px-5 py-4 text-slate-900 focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Название новости"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold uppercase tracking-wider text-slate-700 ml-1">Slug (URL)</label>
            <input
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-slate-500 outline-none cursor-not-allowed font-mono text-sm"
              value={slug}
              readOnly
            />
          </div>
        </div>

        {/* Дата публикации */}
        <div className="space-y-3">
          <label className="text-sm font-bold uppercase tracking-wider text-slate-900 ml-1">Дата и время публикации</label>
          <input 
            type="datetime-local" 
            value={createdAt}
            onChange={(e) => setCreatedAt(e.target.value)}
            className="w-full md:w-1/3 bg-white border border-slate-300 rounded-xl px-5 py-4 text-slate-900 focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all [color-scheme:light]"
          />
        </div>

        {/* Медиатека (Обложка) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between ml-1">
            <label className="text-sm font-bold uppercase tracking-wider text-slate-900">Обложка новости</label>
            <span className="text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded">Выберите одно фото</span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 max-h-[320px] overflow-y-auto p-5 bg-white border border-slate-200 rounded-2xl custom-scrollbar shadow-inner">
            {mediaList.map((media) => {
              const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${media.bucket}/${media.path}`;
              const isActive = coverImageId === media.id;

              return (
                <div
                  key={media.id}
                  onClick={() => setCoverImageId(media.id)}
                  className={`relative cursor-pointer aspect-square border-2 rounded-xl overflow-hidden transition-all duration-200 group ${
                    isActive 
                      ? 'border-blue-500 scale-95 ring-4 ring-blue-100' 
                      : 'border-slate-100 hover:border-slate-300 hover:shadow-md'
                  }`}
                >
                  <img
                    src={url}
                    className={`h-full w-full object-cover transition-transform group-hover:scale-105`}
                    alt=""
                  />
                  {isActive && (
                    <div className="absolute inset-0 bg-blue-500/10 flex items-center justify-center">
                      <div className="bg-blue-500 text-white rounded-full p-1 shadow-lg">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M20 6L9 17l-5-5"/></svg>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Редактор */}
        <div className="space-y-3">
          <label className="text-sm font-bold uppercase tracking-wider text-slate-900 ml-1">Контент новости</label>
          <div className="rounded-2xl overflow-hidden border border-slate-300 bg-white">
            <Editor content={body} onChange={setBody} />
          </div>
        </div>

        {/* Нижняя панель с кнопками */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-6 border-t border-slate-100">
          <label className="flex items-center gap-3 cursor-pointer group bg-slate-50 px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-100 transition-all">
            <input
              type="checkbox"
              className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-200 cursor-pointer transition-all"
              checked={isVisible}
              onChange={(e) => setIsVisible(e.target.checked)}
            />
            <span className="text-sm font-bold text-slate-700">Опубликовано на сайте</span>
          </label>

          <button
            type="submit"
            disabled={saving}
            className="w-full md:w-auto px-12 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-slate-300 disabled:text-slate-600 font-bold transition-all shadow-lg shadow-blue-500/10 flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Сохранение...
              </>
            ) : (
              'Сохранить изменения'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}