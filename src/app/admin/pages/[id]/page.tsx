export default function AdminPagesEditPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-semibold">Edit page</h1>

      <form className="space-y-4">
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Title"
          defaultValue="—"
        />

        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Slug"
          defaultValue="/—"
        />

        <textarea
          className="w-full border rounded px-3 py-2 min-h-[120px]"
          placeholder="Body"
          defaultValue="—"
        />

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" />
          Visible
        </label>

        <div className="flex gap-2">
          <button className="px-4 py-2 bg-black text-white rounded">
            Save
          </button>

          <button
            type="button"
            className="px-4 py-2 border rounded text-red-600"
          >
            Delete
          </button>
        </div>
      </form>
    </div>
  );
}
