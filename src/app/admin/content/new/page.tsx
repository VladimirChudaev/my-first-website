import Link from 'next/link';

export default function AdminContentCreatePage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">New content</h1>

        <Link href="/admin/content" className="text-sm underline">
          Back to list
        </Link>
      </div>

      <form className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Title</label>
          <input className="w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm mb-1">Slug</label>
          <input className="w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm mb-1">Scope</label>
          <select className="w-full border rounded px-3 py-2">
            <option value="global">Global</option>
            <option value="page">Page</option>
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">Body</label>
          <textarea className="w-full border rounded px-3 py-2 min-h-[160px]" />
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" id="visible" />
          <label htmlFor="visible" className="text-sm">
            Visible
          </label>
        </div>

        <button className="px-4 py-2 rounded bg-black text-white text-sm">
          Create
        </button>
      </form>
    </div>
  );
}
