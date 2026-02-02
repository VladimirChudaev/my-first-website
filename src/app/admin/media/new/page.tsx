import Link from 'next/link';

export default function AdminMediaCreatePage() {
  return (
    <div className="max-w-xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">New media</h1>

        <Link href="/admin/media" className="text-sm underline">
          Back to list
        </Link>
      </div>

      <form className="space-y-4">
        <div>
          <label className="block text-sm mb-1">File</label>
          <input type="file" className="w-full" />
        </div>

        <div>
          <label className="block text-sm mb-1">Alt text</label>
          <input className="w-full border rounded px-3 py-2" />
        </div>

        <button className="px-4 py-2 rounded bg-black text-white text-sm">
          Upload
        </button>
      </form>
    </div>
  );
}
