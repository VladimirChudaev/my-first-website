// src/app/admin/news/page.tsx
import Link from 'next/link';

export default function AdminNewsListPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">News</h1>

        <Link
          href="/admin/news/new"
          className="px-4 py-2 rounded bg-black text-white text-sm"
        >
          Add news
        </Link>
      </div>

      <div className="bg-white border rounded">
        <table className="w-full text-sm">
          <thead className="border-b">
            <tr className="text-left">
              <th className="p-3">Title</th>
              <th className="p-3">Slug</th>
              <th className="p-3">Visible</th>
              <th className="p-3 w-[120px]">Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-b last:border-0">
              <td className="p-3">—</td>
              <td className="p-3">—</td>
              <td className="p-3">—</td>
              <td className="p-3">
                <span className="text-gray-400">—</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
