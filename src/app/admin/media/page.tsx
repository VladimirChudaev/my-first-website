'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/client'; // Важно: используем клиентский конфиг

export default function AdminMediaListPage() {
  const [mediaItems, setMediaItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  // Загрузка данных
  useEffect(() => {
    fetchMedia();
  }, []);

  async function fetchMedia() {
    const { data } = await supabase
      .from('media')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setMediaItems(data);
    setLoading(false);
  }

  // Функция удаления
  async function handleDelete(item: any) {
    if (!confirm(`Удалить файл ${item.filename}?`)) return;

    try {
      // 1. Удаляем из хранилища (Storage)
      await supabase.storage.from(item.bucket).remove([item.filename]);
      // 2. Удаляем запись из базы (Database)
      await supabase.from('media').delete().eq('id', item.id);
      
      setMediaItems(mediaItems.filter(i => i.id !== item.id));
    } catch (error) {
      alert('Ошибка при удалении');
    }
  }

  // Переключение видимости
  async function toggleVisible(item: any) {
    const nextStatus = !item.is_visible;
    const { error } = await supabase
      .from('media')
      .update({ is_visible: nextStatus })
      .eq('id', item.id);

    if (!error) {
      setMediaItems(mediaItems.map(i => i.id === item.id ? { ...i, is_visible: nextStatus } : i));
    }
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Медиабиблиотека</h1>
        <Link
          href="/admin/media/new"
          className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm transition-colors shadow-sm"
        >
          + Добавить медиа
        </Link>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 border-b text-gray-500 uppercase text-[10px] font-bold tracking-wider">
            <tr>
              <th className="p-4">Превью</th>
              <th className="p-4">Название / Файл</th>
              <th className="p-4">Категория</th>
              <th className="p-4 text-center">Статус</th>
              <th className="p-4 text-right">Действия</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {!loading && mediaItems.map((item) => (
              <tr key={item.id} className={`hover:bg-gray-50/50 transition-colors ${!item.is_visible ? 'opacity-60' : ''}`}>
                <td className="p-4 w-24">
                  <div className="w-16 h-10 rounded border bg-gray-100 overflow-hidden shadow-sm">
                    <img 
                      src={`https://hdrxoowpnhrschlonivc.supabase.co/storage/v1/object/public/${item.bucket}/${item.filename}`}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                </td>
                <td className="p-4">
                  <div className="font-medium text-gray-900">{item.title || 'Без названия'}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{item.filename}</div>
                </td>
                <td className="p-4">
                  <span className="px-2 py-0.5 bg-gray-100 border rounded-full text-[10px] font-bold text-gray-500 uppercase">
                    {item.category}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <button 
                    onClick={() => toggleVisible(item)}
                    className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase transition-colors ${
                      item.is_visible 
                        ? 'bg-green-50 text-green-700 border border-green-200' 
                        : 'bg-gray-100 text-gray-500 border border-gray-200'
                    }`}
                  >
                    {item.is_visible ? 'Виден' : 'Скрыт'}
                  </button>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-3 items-center">
                    <Link
                      href={`/admin/media/${item.id}`}
                      className="text-indigo-600 hover:text-indigo-900 font-bold text-[11px] uppercase"
                    >
                      Изменить
                    </Link>
                    <button
                      onClick={() => handleDelete(item)}
                      className="text-red-500 hover:text-red-700 font-bold text-[11px] uppercase"
                    >
                      Удалить
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {mediaItems.length === 0 && !loading && (
          <div className="p-12 text-center text-gray-400 italic">Медиафайлы не найдены.</div>
        )}
      </div>
    </div>
  );
}