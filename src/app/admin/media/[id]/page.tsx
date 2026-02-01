export default function AdminMediaEditPage() {
  return (
    <div className="space-y-6 max-w-xl">
      <h1 className="text-2xl font-semibold">Media item</h1>

      <div className="border rounded p-4 space-y-4">
        <div className="text-sm text-gray-500">
          Preview
        </div>

        <div className="h-40 bg-gray-100 flex items-center justify-center">
          —
        </div>

        <button
          type="button"
          className="px-4 py-2 border rounded text-red-600"
        >
          Delete media
        </button>
      </div>
    </div>
  );
}
