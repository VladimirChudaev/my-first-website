'use client';
import { useEffect, useState } from 'react';

export default function AdminProjectsPage() {
  const [blocks, setBlocks] = useState<any[]>([]);

  useEffect(() => { fetch('/api/pages/projects').then(r => r.json()).then(r => setBlocks(r.data ?? [])); }, []);

  const save = async (block: any) => {
    const res = await fetch('/api/pages/projects', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(block),
    });
    if (res.ok) alert('Saved!');
  };

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Редактор страницы Проекты</h1>
      {blocks.map((b, i) => (
        <div key={b.id} className="p-4 border rounded-lg space-y-4 bg-white shadow-sm">
          <div className="flex justify-between font-bold text-blue-600"><span>Блок: {b.section_key}</span><button onClick={() => save(b)} className="bg-blue-600 text-white px-3 py-1 rounded">Сохранить</button></div>
          <div className="grid grid-cols-2 gap-4">
            <input className="border p-2 rounded" value={b.title} onChange={e => { const n = [...blocks]; n[i].title = e.target.value; setBlocks(n); }} placeholder="Заголовок" />
            <input className="border p-2 rounded" value={b.bg_color} onChange={e => { const n = [...blocks]; n[i].bg_color = e.target.value; setBlocks(n); }} placeholder="Tailwind класс фона" />
          </div>
          <textarea className="w-full border p-2 rounded" rows={3} value={b.body} onChange={e => { const n = [...blocks]; n[i].body = e.target.value; setBlocks(n); }} placeholder="Описание" />
        </div>
      ))}
    </div>
  );
}