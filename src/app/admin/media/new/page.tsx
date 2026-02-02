'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminMediaCreatePage() {
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    await fetch('/api/admin/media', {
      method: 'POST',
      body: formData,
    });

    router.push('/admin/media');
  }

  return (
    <div className="space-y-6 max-w-xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Upload media</h1>
        <Link href="/admin/media" className="text-sm underline">
          Back to list
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="file"
          name="file"
          className="w-full"
          required
        />

        <button className="px-4 py-2 rounded bg-black text-white text-sm">
          Upload
        </button>
      </form>
    </div>
  );
}
