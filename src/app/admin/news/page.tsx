import Link from 'next/link';
import { getNewsList } from '@/lib/news/service';
import DataTable, { DataTableColumn } from '@/components/admin/DataTable';
import { NewsItem } from '@/lib/news/types';

export const dynamic = 'force-dynamic';

export default async function AdminNewsListPage() {
  const { data: news } = await getNewsList();

  const columns: DataTableColumn<NewsItem>[] = [
    {
      title: 'Image',
      key: 'media',
      render: (_, row) => {
        const media = row.media ?? null;

        if (!media) return '—';

        const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${media.bucket}/${media.path}`;

        return (
          <img
            src={url}
            className="h-12 w-20 object-cover rounded"
          />
        );
      },
    },
    { title: 'Title', key: 'title' },
    { title: 'Slug', key: 'slug' },
    {
      title: 'Visible',
      key: 'is_visible',
      render: (val) => (val ? '✅ Yes' : '❌ No'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, row) => (
        <div className="flex gap-4">
          <Link
            href={`/admin/news/${row.id}`}
            className="text-blue-600 hover:underline"
          >
            Edit
          </Link>

          <Link
            href={`/api/admin/news/${row.id}?delete=1`}
            className="text-red-600 hover:underline"
          >
            Delete
          </Link>
        </div>
      ),
    },
  ];

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

      <DataTable columns={columns} data={news} />
    </div>
  );
}
