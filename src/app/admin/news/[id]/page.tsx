'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';

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
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const [loading, setLoading] = useState(true);

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
        setLoading(false);
      });

    fetch(`/api/admin/media?category=photo`)
      .then((res) => res.json())
      .then((res) => setMediaList(res.data || []));
  }, [params.id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await fetch(`/api/admin/news/${params.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        slug,
        body,
        is_visible: isVisible,
        cover_image_id: coverImageId,
      }),
    });

    router.push('/admin/news');
    router.refresh();
  }

  if (loading) return <p className="p-8">Loading...</p>;

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-2xl font-semibold">Edit news</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 border rounded">
        <input
          className="w-full border rounded px-3 py-2 font-medium"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />

        <input
          className="w-full border rounded px-3 py-2 bg-gray-50 text-sm"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="Slug"
        />

        {/* MEDIA PICKER */}
        <div>
          <p className="mb-2 text-sm font-medium">Cover image</p>
          <div className="grid grid-cols-4 gap-3">
            {mediaList.map((media) => {
              const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${media.bucket}/${media.path}`;

              return (
                <div
                  key={media.id}
                  onClick={() => setCoverImageId(media.id)}
                  className={`cursor-pointer border rounded overflow-hidden ${
                    coverImageId === media.id
                      ? 'ring-2 ring-black'
                      : ''
                  }`}
                >
                  <img
                    src={url}
                    className="h-24 w-full object-cover"
                  />
                </div>
              );
            })}
          </div>
        </div>

        <textarea
          className="w-full border rounded px-3 py-2 min-h-[200px]"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isVisible}
            onChange={(e) => setIsVisible(e.target.checked)}
          />
          Visible
        </label>

        <button
          type="submit"
          className="px-4 py-2 bg-black text-white rounded text-sm"
        >
          Save
        </button>
      </form>
    </div>
  );
}
