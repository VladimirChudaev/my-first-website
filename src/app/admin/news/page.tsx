import Link from 'next/link';
import { getNewsList, deleteNewsById } from '@/lib/news/service';
import DataTable, { DataTableColumn } from '@/components/admin/DataTable';
import { NewsItem } from '@/lib/news/types';
import { revalidatePath } from 'next/cache';
import { Pencil, Trash2 } from 'lucide-react'; // ИМПОРТ ИКОНОК

export const dynamic = 'force-dynamic';

export default async function AdminNewsListPage() {
  const { data: news } = await getNewsList();

  async function deleteAction(formData: FormData) {
    'use server';
    const id = formData.get('id') as string;
    if (id) {
      await deleteNewsById(id);
      revalidatePath('/admin/news');
    }
  }

  const columns: DataTableColumn<NewsItem>[] = [
    {
      title: 'IMAGE',
      key: 'media',
      render: (_, row) => {
        const media = row.media ?? null;
        const url = media ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${media.bucket}/${media.path}` : null;
        return (
          <div className="w-16 h-10 rounded overflow-hidden bg-slate-100 border border-slate-200">
            {url ? (
              <img src={url} className="w-full h-full object-cover" alt="" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[8px] text-slate-400 uppercase">No img</div>
            )}
          </div>
        );
      },
    },
    { 
      title: 'TITLE', 
      key: 'title',
      render: (val) => <div className="text-slate-900 font-medium">{String(val)}</div>
    },
    {
      title: 'VISIBLE',
      key: 'is_visible',
      render: (val) => (
        <span className={`text-[10px] font-bold px-2 py-1 rounded ${val ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {val ? 'YES' : 'NO'}
        </span>
      ),
    },
    {
      title: '', // ПУСТОЙ ЗАГОЛОВОК ДЛЯ ДЕЙСТВИЙ
      key: 'actions',
      render: (_, row) => (
        <div className="flex gap-2 justify-end">
          {/* ИКОНКА РЕДАКТИРОВАНИЯ */}
          <Link
            href={`/admin/news/${row.id}`}
            className="p-2 text-slate-400 hover:text-blue-500 transition-colors"
          >
            <Pencil size={18} />
          </Link>
          
          {/* ИКОНКА УДАЛЕНИЯ */}
          <form action={deleteAction} className="inline-flex">
            <input type="hidden" name="id" value={row.id} />
            <button 
              type="submit" 
              className="p-2 text-slate-400 hover:text-red-500 transition-colors cursor-pointer bg-transparent border-none"
            >
              <Trash2 size={18} />
            </button>
          </form>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-[1200px] mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Новости</h1>
        <Link
          href="/admin/news/new"
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-all"
        >
          + Добавить новость
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <DataTable columns={columns} data={news || []} />
      </div>
    </div>
  );
}