import Link from 'next/link';

export default function AdminNewsCreatePage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">New news</h1>

        <Link
          href="/admin/news"
          className="text-sm underline"
        >
          Back to list
        </Link>
      </div>

      <form className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Title</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            placeholder="Title"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Slug</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            placeholder="slug"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Body</label>
          <textarea
            className="w-full border rounded px-3 py-2 min-h-[160px]"
            placeholder="Text"
          />
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" id="visible" />
          <label htmlFor="visible" className="text-sm">
            Visible
          </label>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="px-4 py-2 rounded bg-black text-white text-sm"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
}
