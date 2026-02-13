'use client';

import { useEffect, useState } from 'react';

export default function AdminHomePage() {
  const [blocks, setBlocks] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/pages/home')
      .then((r) => r.json())
      .then((r) => setBlocks(r.data ?? []));
  }, []);

  const handleSave = async (block: any) => {
    try {
      const res = await fetch('/api/pages/home', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(block),
      });
      
      const result = await res.json();
      
      if (res.ok) {
        alert('Настройки главной сохранены!');
      } else {
        alert('Ошибка при сохранении: ' + result.error);
      }
    } catch (err) {
      alert('Сетевая ошибка');
    }
  };

  return (
    <div className="p-8 max-w-5xl space-y-6">
      <h1 className="text-2xl font-bold">Контент главной страницы</h1>
      
      {blocks.length === 0 && <p className="text-gray-500">Блоки не найдены.</p>}

      <div className="space-y-6">
        {blocks.map((b, i) => (
          <div key={b.id} className="bg-white border rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <span className="font-bold text-blue-600 uppercase">Блок: {b.section_key}</span>
              <button 
                onClick={() => handleSave(b)}
                className="px-4 py-1.5 bg-black text-white text-sm rounded-lg hover:bg-gray-800 transition-colors"
              >
                Сохранить
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500">ЗАГОЛОВОК</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  value={b.title || ''}
                  onChange={(e) => {
                    const n = [...blocks];
                    n[i].title = e.target.value;
                    setBlocks(n);
                  }}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500">ТЕКСТ / ОПИСАНИЕ</label>
                <textarea
                  rows={4}
                  className="w-full p-2 border rounded-md"
                  value={b.body || ''}
                  onChange={(e) => {
                    const n = [...blocks];
                    n[i].body = e.target.value;
                    setBlocks(n);
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}