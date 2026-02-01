import Link from 'next/link';

export default function AdminMediaListPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Media</h1>

        <Link
          href="/admin/media/new"
          className="px-4 py-2 rounded bg-black text-white text-sm"
        >
          Add media
        </Link>
      </div>

      <div className="bg-white border rounded">
        <table className="w-full text-sm">
          <thead className="border-b">
            <tr className="text-left">
              <th className="p-3">Filename</th>
              <th className="p-3">Type</th>
              <th className="p-3">Size</th>
              <th className="p-3 w-[120px]">Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-b last:border-0">
              <td className="p-3">—</td>
              <td className="p-3">—</td>
              <td className="p-3">—</td>
              <td className="p-3 text-gray-400">—</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
