'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminContentListPage() {
  const [content, setContent] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/admin/content')
      .then(res => res.json())
      .then(res => setContent(res.data || []));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Страницы и Тексты</h1>
        <Link href="/admin/content/new" className="px-4 py-2 rounded-xl bg-black text-white text-sm">Добавить страницу</Link>
      </div>

      <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">Заголовок</th>
              <th className="p-4">Slug</th>
              <th className="p-4">Область (Scope)</th>
              <th className="p-4 text-right">Действия</th>
            </tr>
          </thead>
          <tbody>
            {content.map((item) => (
              <tr key={item.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="p-4 font-medium">{item.title}</td>
                <td className="p-4 text-gray-500">{item.slug}</td>
                <td className="p-4 text-gray-500">{item.scope}</td>
                <td className="p-4 text-right">
                  <Link href={`/admin/content/${item.id}`} className="text-blue-600 hover:underline">Изменить</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}