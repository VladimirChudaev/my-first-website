'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminContentCreatePage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [body, setBody] = useState('');
  const [scope, setScope] = useState<'global' | 'page'>('global');
  const [isVisible, setIsVisible] = useState(true);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await fetch('/api/admin/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        slug,
        body,
        scope,
        is_visible: isVisible,
      }),
    });

    router.push('/admin/content');
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">New content</h1>
        <Link href="/admin/content" className="text-sm underline">
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

        <select
          className="w-full border rounded px-3 py-2"
          value={scope}
          onChange={(e) => setScope(e.target.value as any)}
        >
          <option value="global">Global</option>
          <option value="page">Page</option>
        </select>

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
