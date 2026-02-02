// src/app/admin/pages/[id]/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Props = {
  params: { id: string };
};

export default function AdminPagesEditPage({ params }: Props) {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [body, setBody] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    await fetch(`/api/admin/pages/${params.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        slug,
        body,
        is_visible: isVisible,
      }),
    });

    setLoading(false);
    router.push('/admin/pages');
  }

  async function handleDelete() {
    if (!confirm('Delete page?')) return;

    await fetch(`/api/admin/pages/${params.id}`, {
      method: 'DELETE',
    });

    router.push('/admin/pages');
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Edit page</h1>
        <Link href="/admin/pages" className="text-sm underline">
          Back to list
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          placeholder="Title"
          className="w-full border rounded px-3 py-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          placeholder="Slug"
          className="w-full border rounded px-3 py-2"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
        />

        <textarea
          placeholder="Body"
          className="w-full border rounded px-3 py-2 min-h-[200px]"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />

        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={isVisible}
            onChange={(e) => setIsVisible(e.target.checked)}
          />
          Visible
        </label>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded bg-black text-white text-sm"
          >
            Save
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="px-4 py-2 rounded border text-sm"
          >
            Delete
          </button>
        </div>
      </form>
    </div>
  );
}
