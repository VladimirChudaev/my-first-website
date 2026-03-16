'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Editor from '@/components/admin/Editor';

export default function AdminNewsCreatePage() {
  const router = useRouter();

  // Состояния формы
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [body, setBody] = useState('');
  const [coverImageId, setCoverImageId] = useState<string | null>(null);
  const [createdAt, setCreatedAt] = useState(new Date().toISOString().slice(0, 16)); 
  
  // Состояния загрузки медиа
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingMedia, setFetchingMedia] = useState(true);

  // Загрузка медиатеки
  useEffect(() => {
    setFetchingMedia(true);
    fetch('/api/admin/media')
      .then((res) => {
        if (!res.ok) throw new Error('Ошибка сервера');
        return res.json();
      })
      .then((res) => setMediaList(res.data || []))
      .catch(() => toast.error('Не удалось загрузить медиатеку'))
      .finally(() => setFetchingMedia(false));
  }, []);

  const generateSlug = (text: string) => {
    const rus = "щ ш ч ц ю я ё ж ъ ы э а б в г д е з и й к л м н о п р с т у ф х ь".split(' ');
    const eng = "shch sh ch ts yu ya yo zh `` y e a b v g d e z i y k l m n o p r s t u f h `".split(' ');
    let res = text.toLowerCase();
    for (let i = 0; i < rus.length; i++) {
      res = res.split(rus[i]).join(eng[i]);
    }
    return res
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  // Измененная функция отправки: принимает параметр isPublished
  const handleSubmit = async (e: React.FormEvent, isPublished: boolean) => {
    e.preventDefault();
    if (!coverImageId) {
      toast.error('Выберите обложку');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/admin/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          body,
          cover_image_id: coverImageId,
          created_at: createdAt,
          is_visible: isPublished, // Отправляем статус видимости
        }),
      });

      if (res.ok) {
        toast.success(isPublished ? 'Новость опубликована' : 'Сохранено в черновики');
        router.push('/admin/news');
        router.refresh();
      } else {
        const errData = await res.json();
        toast.error(errData.error || 'Ошибка создания');
      }
    } catch (err) {
      toast.error('Сетевая ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10 px-4">
      <div className="flex items-center justify-between py-2 border-b border-slate-200">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Новая новость</h1>
        <button 
          onClick={() => router.back()}
          className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
        >
          Отмена
        </button>
      </div>
      
      {/* Убираем onSubmit из тега form, так как у нас разные действия на кнопках */}
      <form onSubmit={(e) => e.preventDefault()} className="space-y-8 bg-white p-6 md:p-10 border border-slate-100 rounded-3xl shadow-xl">
        
        {/* Заголовок и Slug */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-sm font-bold uppercase tracking-wider text-slate-900 ml-1">Заголовок</label>
            <input
              className="w-full bg-white border border-slate-300 rounded-xl px-5 py-4 text-slate-900 focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all placeholder:text-slate-400"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setSlug(generateSlug(e.target.value));
              }}
              placeholder="Введите название..."
              required
            />
          </div>
          <div className="space-y-3">
            <label className="text-sm font-bold uppercase tracking-wider text-slate-700 ml-1">Slug (URL)</label>
            <input 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-slate-600 outline-none cursor-not-allowed font-mono text-sm"
              value={slug} 
              readOnly 
            />
          </div>
        </div>

        {/* ДАТА ПУБЛИКАЦИИ */}
        <div className="space-y-3">
          <label className="text-sm font-bold uppercase tracking-wider text-slate-900 ml-1">Дата и время публикации</label>
          <input 
            type="datetime-local" 
            value={createdAt}
            onChange={(e) => setCreatedAt(e.target.value)}
            className="w-full md:w-1/3 bg-white border border-slate-300 rounded-xl px-5 py-4 text-slate-900 focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all [color-scheme:light]"
          />
        </div>

        {/* МЕДИАТЕКА */}
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
                  <img src={url} className="h-full w-full object-cover transition-transform group-hover:scale-105" alt="" />
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

        {/* РЕДАКТОР */}
        <div className="space-y-3">
          <label className="text-sm font-bold uppercase tracking-wider text-slate-900 ml-1">Контент новости</label>
          <div className="rounded-2xl overflow-hidden border border-slate-300 bg-white">
            <Editor content={body} onChange={setBody} />
          </div>
        </div>

        {/* БЛОК КНОПОК */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-end gap-4 border-t border-slate-100">
          <button 
            type="button"
            onClick={(e) => handleSubmit(e, false)} // Сохранить как черновик (is_visible: false)
            disabled={loading}
            className="w-full md:w-auto px-8 py-4 bg-slate-100 text-slate-900 rounded-xl hover:bg-slate-200 disabled:opacity-50 font-bold transition-all"
          >
            Сохранить черновик
          </button>
          
          <button 
            type="button"
            onClick={(e) => handleSubmit(e, true)} // Опубликовать сразу (is_visible: true)
            disabled={loading}
            className="w-full md:w-auto px-12 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-slate-300 disabled:text-slate-600 font-bold transition-all shadow-lg shadow-blue-500/10 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Обработка...
              </>
            ) : (
              'Опубликовать новость'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}