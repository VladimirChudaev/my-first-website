// src/app/admin/media/[id]/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Props = {
  params: { id: string };
};

export default function AdminMediaEditPage({ params }: Props) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm('Delete media file?')) return;

    await fetch(`/api/admin/media/${params.id}`, {
      method: 'DELETE',
    });

    router.push('/admin/media');
  }

  return (
    <div className="space-y-6 max-w-xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Media item</h1>
        <Link href="/admin/media" className="text-sm underline">
          Back to list
        </Link>
      </div>

      <div className="border rounded p-4 bg-white space-y-4">
        <p className="text-sm text-gray-500">
          ID: {params.id}
        </p>

        <button
          onClick={handleDelete}
          className="px-4 py-2 rounded border text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
