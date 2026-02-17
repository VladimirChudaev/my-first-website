import Link from 'next/link';
import { getNewsList } from '@/lib/news/service';
import DataTable, { DataTableColumn } from '@/components/admin/DataTable';
import { NewsItem } from '@/lib/news/types';

export const dynamic = 'force-dynamic';

export default async function AdminNewsListPage() {
  const { data: news } = await getNewsList();

  const columns: DataTableColumn<NewsItem>[] = [
    { title: 'Title', key: 'title' },
    { title: 'Slug', key: 'slug' },
    { 
      title: 'Visible', 
      key: 'is_visible', 
      render: (val) => (val ? '✅ Yes' : '❌ No') 
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, row) => (
        <Link href={`/admin/news/${row.id}`} className="text-blue-600 hover:underline">
          Edit
        </Link>
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