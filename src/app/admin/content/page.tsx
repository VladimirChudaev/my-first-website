'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminContentListPage() {
  const [content, setContent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/content')
      .then(res => res.json())
      .then(res => {
        setContent(res.data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Ошибка загрузки:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Страницы и Тексты</h1>
        <Link href="/admin/content/new" className="px-4 py-2 rounded-xl bg-black text-white text-sm">
          Добавить запись
        </Link>
      </div>

      <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 border-b text-gray-700 uppercase text-xs">
            <tr>
              <th className="p-4">Заголовок (Title)</th>
              <th className="p-4">Страница (Page)</th>
              <th className="p-4">Ключ секции (Key)</th>
              <th className="p-4 text-center">Статус</th>
              <th className="p-4 text-right">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">Загрузка данных...</td>
              </tr>
            ) : content.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">Записей не найдено</td>
              </tr>
            ) : (
              content.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-gray-900">
                    {item.title || <span className="text-gray-400 italic">Без заголовка</span>}
                  </td>
                  <td className="p-4 text-gray-600">
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs">{item.page}</span>
                  </td>
                  <td className="p-4 text-gray-500 font-mono text-xs">{item.section_key}</td>
                  <td className="p-4 text-center">
                    {item.is_visible ? (
                      <span className="text-green-600 text-xs font-semibold">Вкл.</span>
                    ) : (
                      <span className="text-gray-400 text-xs">Выкл.</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <Link 
                      href={`/admin/content/${item.id}`} 
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Изменить
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}