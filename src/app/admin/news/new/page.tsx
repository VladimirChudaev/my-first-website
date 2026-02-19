'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function AdminNewsCreatePage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [body, setBody] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

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

    if (!file) {
      toast.error('Загрузите фото');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('slug', slug);
    formData.append('body', body);
    formData.append('file', file);

    const res = await fetch('/api/admin/news', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      toast.success('Новость создана');
      router.push('/admin/news');
      router.refresh();
    } else {
      toast.error('Ошибка создания');
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <input
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          setSlug(generateSlug(e.target.value));
        }}
        placeholder="Заголовок"
        required
      />

      <input value={slug} readOnly />

      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />

      <button disabled={loading}>
        {loading ? 'Сохранение...' : 'Опубликовать'}
      </button>
    </form>
  );
}
