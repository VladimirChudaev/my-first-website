import Link from 'next/link';

export default function AdminPageCreatePage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">New page</h1>

        <Link href="/admin/pages" className="text-sm underline">
          Back to list
        </Link>
      </div>

      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Title
          </label>
          <input className="w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Slug
          </label>
          <input className="w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Body
          </label>
          <textarea className="w-full border rounded px-3 py-2 min-h-[200px]" />
        </div>

        <div>
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" defaultChecked />
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
