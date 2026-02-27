'use client';
import { useEffect, useState } from 'react';
import Editor from '@/components/admin/Editor';
import toast from 'react-hot-toast';

export default function AdminProjectsPage() {
  const [blocks, setBlocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Загрузка данных
  useEffect(() => { 
    fetch('/api/pages/projects', { cache: 'no-store' })
      .then(r => r.json())
      .then(r => {
        setBlocks(r.data ?? []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Fetch error:', err);
        setLoading(false);
      });
  }, []);

  // 2. Функция сохранения (в строгом стиле)
  const handleSave = async (index: number) => {
    const blockToSave = blocks[index];
    
    try {
      const res = await fetch('/api/pages/projects', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: blockToSave.id,
          title: blockToSave.title,
          body: blockToSave.body,
          bg_color: blockToSave.bg_color
        }),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success('Сохранено');
      } else {
        throw new Error(result.error || 'Ошибка сервера');
      }
    } catch (error: any) {
      console.error('Save error:', error);
      toast.error(`Ошибка: ${error.message}`);
    }
  };

  if (loading) return <div className="p-8 text-sm">Загрузка данных...</div>;

  return (
    <div className="p-8 space-y-8 max-w-5xl">
      <div className="flex justify-between items-center border-b pb-4">
        <h1 className="text-xl font-semibold text-slate-900">Редактор: Проекты</h1>
        <span className="text-xs text-slate-400 font-mono">Blocks: {blocks.length}</span>
      </div>

      {blocks.length === 0 && (
        <div className="p-10 text-center border border-dashed rounded-lg text-slate-400 text-sm">
          Данные не найдены в базе.
        </div>
      )}

      {blocks.map((b, i) => (
        <div key={b.id || i} className="p-6 border rounded-xl bg-white shadow-sm space-y-6 border-slate-200">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-tight">ID секции</span>
              <span className="font-mono text-sm font-semibold">{b.section_key}</span>
            </div>
            
            {/* КНОПКА В СТИЛЕ SHADCN (ЧЕРНО-БЕЛАЯ) */}
            <button 
              onClick={() => handleSave(i)} 
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-black text-white shadow hover:bg-black/90 h-9 px-6 active:scale-95"
            >
              Сохранить
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-500">Заголовок</label>
              <input 
                className="w-full border border-slate-200 p-2.5 rounded-md focus:ring-1 ring-black outline-none transition-all text-sm" 
                value={b.title || ''} 
                onChange={e => {
                  const newList = [...blocks];
                  newList[i].title = e.target.value;
                  setBlocks(newList);
                }} 
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-500">Цвет фона (Tailwind класс)</label>
              <input 
                className="w-full border border-slate-200 p-2.5 rounded-md focus:ring-1 ring-black outline-none transition-all font-mono text-sm" 
                placeholder="bg-[#ffffff]"
                value={b.bg_color || ''} 
                onChange={e => {
                  const newList = [...blocks];
                  newList[i].bg_color = e.target.value;
                  setBlocks(newList);
                }} 
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-500">Контент (HTML)</label>
            <Editor 
              content={b.body || ''} 
              onChange={(html) => {
                const newList = [...blocks];
                newList[i].body = html;
                setBlocks(newList);
              }} 
            />
          </div>
        </div>
      ))}
    </div>
  );
}