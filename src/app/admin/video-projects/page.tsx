'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Pencil, Trash2, Plus, LayoutList, Image as ImageIcon } from 'lucide-react'; 
import DataTable, { DataTableColumn } from '@/components/admin/DataTable';
import { getVideoProjects } from '@/lib/video-projects/video-projects.supabase';
import { VideoProject } from '@/lib/video-projects/types';

export default function VideoProjectsAdminPage() {
  const [items, setItems] = useState<VideoProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const data = await getVideoProjects();
      setItems(data);
    } catch (err) {
      console.error('Ошибка при загрузке данных:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить этот элемент из карусели?')) return;

    try {
      const response = await fetch(`/api/admin/video-projects/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setItems((prev) => prev.filter((item) => item.id !== id));
      } else {
        alert('Ошибка при удалении');
      }
    } catch (err) {
      console.error('Ошибка запроса:', err);
    }
  };

  const columns: DataTableColumn<VideoProject>[] = [
    {
      key: 'media',
      title: 'ОБЛОЖКА',
      className: 'w-24',
      render: (media: any) => (
        <div className="w-16 h-10 bg-gray-100 rounded overflow-hidden border flex items-center justify-center">
          {media?.path ? (
            /* Здесь можно использовать ваш хелпер для URL, если нужно, 
               но для превью в админке часто достаточно заглушки или прямого пути */
            <div className="text-[8px] text-gray-400 uppercase">Обложка</div>
          ) : (
            <ImageIcon size={16} className="text-gray-300" />
          )}
        </div>
      ),
    },
    { 
      key: 'title', 
      title: 'НАЗВАНИЕ ПРОЕКТА',
      render: (title) => <span className="font-medium text-slate-700">{title || 'Без названия'}</span>
    },
    { 
      key: 'url', 
      title: 'ССЫЛКА (RUTUBE / EXTERNAL)',
      render: (url: string) => (
        <span className="text-xs text-blue-600 break-all font-mono opacity-80">{url}</span>
      )
    },
    {
      key: 'actions',
      title: 'ДЕЙСТВИЯ',
      className: 'text-right w-24',
      render: (_, row) => (
        <div className="flex justify-end gap-3">
          <Link
            href={`/admin/video-projects/${row.id}`}
            className="text-gray-400 hover:text-blue-600 transition-colors"
          >
            <Pencil size={18} />
          </Link>
          <button
            onClick={() => handleDelete(row.id)}
            className="text-gray-400 hover:text-red-600 transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <LayoutList className="text-blue-600" size={28} /> 
          Видео-проекты (Главная страница)
        </h1>
        <Link
          href="/admin/video-projects/new"
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium uppercase tracking-wider"
        >
          <Plus size={18} /> Добавить элемент
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <DataTable columns={columns} data={items} />
        
        {!loading && items.length === 0 && (
          <div className="text-center py-20 bg-slate-50/50">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 text-slate-400 mb-4">
              <LayoutList size={24} />
            </div>
            <p className="text-slate-500 max-w-xs mx-auto">
              Список пуст. Создайте первый элемент карусели, выбрав обложку и указав ссылку.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}