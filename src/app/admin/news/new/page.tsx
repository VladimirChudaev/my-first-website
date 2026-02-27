'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Editor from '@/components/admin/Editor';

export default function AdminNewsCreatePage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [body, setBody] = useState('');
  const [coverImageId, setCoverImageId] = useState<string | null>(null);
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingMedia, setFetchingMedia] = useState(true);

  // Подгружаем список доступных фото (убрали фильтр ?category=photo для теста)
  useEffect(() => {
    setFetchingMedia(true);
    fetch('/api/admin/media')
      .then((res) => {
        if (!res.ok) throw new Error('Ошибка сервера при загрузке медиа');
        return res.json();
      })
      .then((res) => {
        setMediaList(res.data || []);
      })
      .catch((err) => {
        console.error(err);
        toast.error('Не удалось загрузить медиатеку');
      })
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!coverImageId) {
      toast.error('Выберите обложку из медиатеки');
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
        }),
      });

      if (res.ok) {
        toast.success('Новость создана');
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
    <div className="max-w-4xl space-y-6">
      <h1 className="text-2xl font-semibold">Новая новость</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 border rounded-2xl shadow-sm">
        <div className="space-y-4">
          <input
            className="w-full border rounded-xl px-4 py-3 font-medium focus:ring-2 ring-black outline-none"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setSlug(generateSlug(e.target.value));
            }}
            placeholder="Заголовок новости"
            required
          />
          <input 
            className="w-full border rounded-xl px-4 py-2 bg-gray-50 text-sm text-gray-500 outline-none"
            value={slug} 
            placeholder="url-адрес"
            readOnly 
          />
        </div>

        {/* МЕДИАТЕКА */}
        <div className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <p className="text-sm font-medium">Выберите обложку</p>
            {fetchingMedia && <span className="text-xs animate-pulse text-gray-400">Загрузка медиа...</span>}
          </div>
          
          <div className="grid grid-cols-4 md:grid-cols-6 gap-3 max-h-[300px] overflow-y-auto p-1 border rounded-xl">
            {mediaList.length > 0 ? (
              mediaList.map((media) => {
                const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${media.bucket}/${media.path}`;
                return (
                  <div
                    key={media.id}
                    onClick={() => setCoverImageId(media.id)}
                    className={`relative cursor-pointer aspect-square border-2 rounded-lg overflow-hidden transition-all ${
                      coverImageId === media.id ? 'border-black ring-2 ring-black/10' : 'border-transparent hover:border-gray-200'
                    }`}
                  >
                    <img src={url} className="h-full w-full object-cover" alt="" />
                  </div>
                );
              })
            ) : (
              !fetchingMedia && (
                <div className="col-span-full py-8 text-center text-gray-400 text-sm">
                  Медиатека пуста или недоступна.
                </div>
              )
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium px-1">Контент</label>
          <Editor content={body} onChange={setBody} />
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full md:w-auto px-8 py-3 bg-black text-white rounded-xl hover:bg-gray-800 disabled:bg-gray-400 font-medium transition-all"
        >
          {loading ? 'Создание...' : 'Опубликовать'}
        </button>
      </form>
    </div>
  );
}