export default function AdminMediaNewPage() {
  return (
    <div className="space-y-6 max-w-xl">
      <h1 className="text-2xl font-semibold">Upload media</h1>

      <form className="space-y-4">
        <input type="file" className="w-full" />

        <button
          type="submit"
          className="px-4 py-2 bg-black text-white rounded"
        >
          Upload
        </button>
      </form>
    </div>
  );
}
