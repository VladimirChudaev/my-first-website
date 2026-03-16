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
        if (!media) return <div className="w-20 text-slate-500">—</div>;

        const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${media.bucket}/${media.path}`;

        return (
          <img
            src={url}
            className="h-10 w-16 object-cover rounded bg-slate-800"
            alt=""
          />
        );
      },
    },
    { 
      title: 'Title', 
      key: 'title',
      render: (val) => (
        <div className="max-w-[300px] truncate font-medium" title={String(val)}>
          {String(val)}
        </div>
      )
    },
    { 
      title: 'Slug', 
      key: 'slug',
      render: (val) => (
        <div className="max-w-[200px] truncate text-slate-400 text-sm" title={String(val)}>
          {String(val)}
        </div>
      )
    },
    {
      title: 'Visible',
      key: 'is_visible',
      render: (val) => (
        <span className="text-sm">
          {val ? '✅ Yes' : '❌ No'}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, row) => (
        <div className="flex gap-4 text-sm font-medium">
          <Link
            href={`/admin/news/${row.id}`}
            className="text-blue-500 hover:text-blue-400 transition-colors"
          >
            Edit
          </Link>
          <Link
            href={`/api/admin/news/${row.id}?delete=1`}
            className="text-red-500 hover:text-red-400 transition-colors"
          >
            Delete
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Новости</h1>
          <p className="text-slate-400 text-sm">Управление публикациями на сайте</p>
        </div>
        <Link
          href="/admin/news/new"
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition-all shadow-lg shadow-blue-900/20"
        >
          + Добавить новость
        </Link>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl">
        <DataTable columns={columns} data={news} />
      </div>
    </div>
  );
}