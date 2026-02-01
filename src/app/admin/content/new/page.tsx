export default function AdminContentNewPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-semibold">New content</h1>

      <form className="space-y-4">
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Title"
        />

        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Slug"
        />

        <select className="w-full border rounded px-3 py-2">
          <option value="global">Global</option>
          <option value="page">Page</option>
        </select>

        <textarea
          className="w-full border rounded px-3 py-2 min-h-[120px]"
          placeholder="Body"
        />

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" />
          Visible
        </label>

        <button
          type="submit"
          className="px-4 py-2 bg-black text-white rounded"
        >
          Create
        </button>
      </form>
    </div>
  );
}
