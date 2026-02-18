'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

export default function AdminNewsCreatePage() {
  const router = useRouter();
  const supabase = createClient();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [body, setBody] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const generateSlug = (text: string) => {
    const rus = "щ ш ч ц ю я ё ж ъ ы э а б в г д е з и й к л м н о п р с т у ф х ь".split(' ');
    const eng = "shch sh ch ts yu ya yo zh `` y e a b v g d e z i y k l m n o p r s t u f h `".split(' ');
    let res = text.toLowerCase();
    for (let i = 0; i < rus.length; i++) {
      res = res.split(rus[i]).join(eng[i]);
    }
    return res.replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    setSlug(generateSlug(val));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    const fileName = `${Math.random()}.${file.name.split('.').pop()}`;
    const { error: uploadError } = await supabase.storage.from('news').upload(fileName, file);
    if (uploadError) {
      toast.error('Ошибка загрузки фото');
      setLoading(false);
      return;
    }
    const { data: { publicUrl } } = supabase.storage.from('news').getPublicUrl(fileName);
    setImageUrl(publicUrl);
    toast.success('Фото загружено');
    setLoading(false);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!imageUrl) return toast.error('Загрузите фото');
    setLoading(true);
    const res = await fetch('/api/admin/news', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, slug, body, is_visible: true, cover_image_url: imageUrl }),
    });
    if (res.ok) {
      toast.success('Новость создана');
      router.push('/admin/news');
      router.refresh();
    } else {
      toast.error('Ошибка сохранения');
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-white text-black relative z-10">
      <main className="pt-32 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border-2 border-gray-100 rounded-2xl p-8 shadow-sm">
            <h1 className="text-2xl font-black mb-8 uppercase tracking-tighter">Новая запись</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-gray-400">Заголовок</label>
                  <input 
                    className="w-full border-b-2 border-gray-100 py-2 focus:border-black outline-none transition-all"
                    value={title} 
                    onChange={handleTitleChange} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-gray-400">Slug (URL)</label>
                  <input className="w-full border-b-2 border-gray-50 py-2 text-gray-400 outline-none" value={slug} readOnly />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-400">Обложка</label>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="block w-full text-sm" />
                {imageUrl && <img src={imageUrl} alt="Preview" className="mt-2 h-48 w-full object-cover rounded shadow-md" />}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-400">Текст новости</label>
                <textarea 
                  className="w-full border-2 border-gray-100 rounded-xl p-4 h-64 focus:border-black outline-none transition-all"
                  value={body} 
                  onChange={(e) => setBody(e.target.value)} 
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-gray-900 transition-colors disabled:bg-gray-200"
              >
                {loading ? 'СОХРАНЕНИЕ...' : 'ОПУБЛИКОВАТЬ'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}