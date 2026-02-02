'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminPageCreatePage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [body, setBody] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    await fetch('/api/admin/pages', {
      method: 'POST',
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

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">New page</h1>
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
          required
        />

        <input
          placeholder="Slug"
          className="w-full border rounded px-3 py-2"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
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

        <button className="px-4 py-2 rounded bg-black text-white text-sm">
          Create
        </button>
      </form>
    </div>
  );
}
