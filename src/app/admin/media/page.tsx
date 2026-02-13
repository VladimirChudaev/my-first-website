'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/client';
import DataTable, { DataTableColumn } from '@/components/admin/DataTable';
import { Pencil, Trash2, Eye, EyeOff } from 'lucide-react';

export default function AdminMediaPage() {
  const [media, setMedia] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const { data } = await supabase
      .from('media')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) {
      const mediaWithUrls = data.map(item => {
        const { data: { publicUrl } } = supabase.storage
          .from('media')
          .getPublicUrl(item.filename);

        return { ...item, full_url: publicUrl };
      });
      
      setMedia(mediaWithUrls);
    }
  }

  const toggleVisibility = async (item: any) => {
    try {
      const newStatus = !item.is_visible;
      const { error } = await supabase
        .from('media')
        .update({ is_visible: newStatus })
        .eq('id', item.id);

      if (error) throw error;

      setMedia(prev => prev.map(m => 
        m.id === item.id ? { ...m, is_visible: newStatus } : m
      ));
    } catch (err) {
      console.error(err);
      alert('Ошибка при обновлении статуса');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить проект?')) return;
    try {
      const response = await fetch(`/api/admin/media/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setMedia(prev => prev.filter(item => item.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const columns: DataTableColumn<any>[] = [
    {
      key: 'full_url', 
      title: 'Превью',
      className: 'w-24',
      render: (url) => (
        <div className="w-16 h-10 bg-gray-100 rounded overflow-hidden border border-gray-100 flex items-center justify-center">
          {url ? (
            <img src={url} alt="preview" className="w-full h-full object-cover" 
                 onError={(e) => {(e.target as HTMLImageElement).src = 'https://placehold.co/64x40?text=Error'}} />
          ) : (
            <div className="text-[10px] text-gray-400">Нет фото</div>
          )}
        </div>
      )
    },
    { key: 'title', title: 'Название проекта' },
    // ДОБАВЛЕНО ПОЛЕ ОПИСАНИЯ
    { 
      key: 'description', 
      title: 'Описание (SEO)',
      render: (text) => (
        <div className="max-w-[200px] truncate text-sm text-gray-500">
          {text || <span className="text-gray-300 italic">Пусто</span>}
        </div>
      )
    },
    { key: 'credits', title: 'Создатели' },
    { 
      key: 'is_visible', 
      title: 'Статус',
      className: 'text-center w-32',
      render: (_, row) => (
        <button 
          onClick={() => toggleVisibility(row)}
          className={`p-2 rounded-full transition-colors ${
            row.is_visible ? 'text-blue-600 hover:bg-blue-50' : 'text-gray-300 hover:bg-gray-50'
          }`}
          title={row.is_visible ? 'Скрыть' : 'Показать'}
        >
          {row.is_visible ? <Eye size={20} /> : <EyeOff size={20} />}
        </button>
      )
    },
    {
      key: 'actions',
      title: 'Действия',
      className: 'text-right w-24',
      render: (_, row) => (
        <div className="flex justify-end gap-3">
          <Link href={`/admin/media/${row.id}`} className="text-gray-400 hover:text-green-600 transition-colors">
            <Pencil size={20} />
          </Link>
          <button onClick={() => handleDelete(row.id)} className="text-gray-400 hover:text-red-600 transition-colors">
            <Trash2 size={20} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Проекты (Медиа)</h1>
        <Link href="/admin/media/new" className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition-colors">
          + Добавить проект
        </Link>
      </div>
      <DataTable columns={columns} data={media} />
    </div>
  );
}