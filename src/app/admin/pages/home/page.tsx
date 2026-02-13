'use client';
import { useState, useEffect } from 'react';

export default function AdminHomePage() {
  const [blocks, setBlocks] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/pages/home').then(res => res.json()).then(data => setBlocks(data.data));
  }, []);

  const handleUpdateField = (id: string, field: string, value: any) => {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, [field]: value } : b));
  };

  const handleSave = async (id: string) => {
    const block = blocks.find(b => b.id === id);
    const res = await fetch('/api/pages/home', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: block.id,
        title: block.title,
        body: block.body,
        is_visible: block.is_visible // Отправляем статус
      })
    });
    if (res.ok) alert('Сохранено');
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {blocks.map(block => (
        <div key={block.id} className="mb-8 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-400 uppercase text-xs tracking-widest">
              Блок: {block.section_key}
            </h3>
            <div className="flex items-center gap-6">
              {/* НОВАЯ КНОПКА ВКЛ/ВЫКЛ */}
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="checkbox"
                  checked={block.is_visible !== false}
                  onChange={(e) => handleUpdateField(block.id, 'is_visible', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-bold text-gray-700 group-hover:text-blue-600 transition-colors">
                  {block.is_visible !== false ? 'ВИДИМЫЙ' : 'СКРЫТ'}
                </span>
              </label>

              <button 
                onClick={() => handleSave(block.id)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-all"
              >
                СОХРАНИТЬ
              </button>
            </div>
          </div>

          <div className="grid gap-4">
            <input 
              className="w-full p-3 border border-gray-200 rounded-lg text-lg font-bold"
              value={block.title || ''}
              placeholder="Заголовок"
              onChange={(e) => handleUpdateField(block.id, 'title', e.target.value)}
            />
            <textarea 
              className="w-full p-3 border border-gray-200 rounded-lg min-h-[100px]"
              value={block.body || ''}
              placeholder="Описание"
              onChange={(e) => handleUpdateField(block.id, 'body', e.target.value)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}