import Link from 'next/link';

type Props = {
  params: {
    id: string;
  };
};

export default function AdminNewsEditPage({ params }: Props) {
  const { id } = params;

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Edit news</h1>

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

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="px-4 py-2 rounded bg-black text-white text-sm"
          >
            Save
          </button>

          <button
            type="button"
            className="px-4 py-2 rounded border text-sm"
            disabled
          >
            Delete
          </button>
        </div>
      </form>

      <div className="text-xs text-gray-400">
        id: {id}
      </div>
    </div>
  );
}
