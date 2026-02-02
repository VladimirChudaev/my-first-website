import Link from 'next/link';

type NewsRow = {
  id: string;
  title: string;
  slug: string;
  is_visible: boolean;
};

// временная заглушка
const mockData: NewsRow[] = [
  {
    id: 'mock-id',
    title: '—',
    slug: '—',
    is_visible: false,
  },
];

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
            {mockData.map((row) => (
              <tr key={row.id} className="border-b last:border-0">
                <td className="p-3">{row.title}</td>
                <td className="p-3">{row.slug}</td>
                <td className="p-3">
                  {row.is_visible ? 'Yes' : 'No'}
                </td>
                <td className="p-3 flex gap-2">
                  <Link
                    href={`/admin/news/${row.id}`}
                    className="text-sm underline"
                  >
                    Edit
                  </Link>

                  <button
                    className="text-sm text-red-600"
                    disabled
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
