'use client';

import { useState, useEffect } from 'react';
import { X, ImageIcon, Save } from 'lucide-react';
import Link from 'next/link';
// Импортируем наш универсальный редактор
import Editor from '@/components/admin/Editor';

export default function AdminFilmReservePage() {
  const [blocks, setBlocks] = useState<any[]>([]);
  const [mediaFiles, setMediaFiles] = useState<any[]>([]);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  
  const storageUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';

  useEffect(() => {
    // Загрузка текстов
    fetch('/api/pages/film-reserve')
      .then(res => res.json())
      .then(data => setBlocks(data.data ?? []));

    // Загрузка всей библиотеки
    fetch('/api/admin/media')
      .then(res => res.json())
      .then(json => setMediaFiles(json.data || []));

    // Загрузка текущего фото страницы
    fetch('/api/admin/media?category=film-reserve')
      .then(res => res.json())
      .then(data => {
        if (data.data && data.data.length > 0) {
          setSelectedFileId(data.data[0].id);
        }
      });
  }, []);

  const handleSelectMedia = async (fileId: string) => {
    try {
      const res = await fetch(`/api/admin/media/${fileId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: 'film-reserve' }),
      });

      if (res.ok) {
        setSelectedFileId(fileId);
        setShowMediaModal(false);
      } else {
        alert('Ошибка при обновлении файла');
      }
    } catch (error) {
      alert('Ошибка соединения с сервером');
    }
  };

  const handleSaveText = async (id: string) => {
    const block = blocks.find(b => b.id === id);
    if (!block) return;

    const res = await fetch('/api/pages/film-reserve', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(block),
    });

    if (res.ok) alert('Данные сохранены успешно');
  };

  const selectedFile = mediaFiles.find(m => m.id === selectedFileId);

  return (
    <div className="p-10 bg-white min-h-screen text-black">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-black uppercase tracking-tight">Film Reserve Editor</h1>
          <Link 
            href="/film-reserve" 
            target="_blank"
            className="text-[10px] font-black uppercase bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            На сайт
          </Link>
        </div>

        {/* БЛОК ИЗОБРАЖЕНИЯ */}
        <div className="mb-8 p-8 bg-gray-50 rounded-[32px] border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-400 uppercase text-[10px] tracking-widest mb-6">Главное фото страницы</h3>
          <div className="flex items-center gap-8">
            <div className="w-56 h-36 bg-white rounded-2xl border-2 border-dashed border-gray-200 overflow-hidden relative flex items-center justify-center">
              {selectedFile ? (
                <img 
                  src={`${storageUrl}/storage/v1/object/public/media/${selectedFile.path}`} 
                  className="w-full h-full object-cover" 
                  alt="Current"
                />
              ) : (
                <ImageIcon size={40} className="text-gray-200" />
              )}
            </div>
            <div className="space-y-2">
              <button 
                onClick={() => setShowMediaModal(true)}
                className="block text-xs font-black uppercase underline hover:text-gray-600 transition-colors"
              >
                Выбрать из библиотеки
              </button>
              <p className="text-[10px] text-gray-400 uppercase">Рекомендуемый размер: 1000x1000px</p>
            </div>
          </div>
        </div>

        {/* СПИСОК ТЕКСТОВЫХ БЛОКОВ */}
        <div className="space-y-6">
          {blocks.map(block => (
            <div key={block.id} className="p-8 bg-white rounded-[32px] border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <span className="font-bold text-gray-400 uppercase text-[10px] tracking-widest">Секция: {block.section_key}</span>
                <button 
                  onClick={() => handleSaveText(block.id)}
                  className="flex items-center gap-2 bg-black text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-gray-800 transition-all shadow-lg active:scale-95"
                >
                  <Save size={14} /> Сохранить
                </button>
              </div>
              <div className="space-y-4">
                <input 
                  className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-xl focus:ring-2 ring-black outline-none transition-all"
                  value={block.title || ''}
                  onChange={e => setBlocks(blocks.map(b => b.id === block.id ? {...b, title: e.target.value} : b))}
                  placeholder="Заголовок"
                />
                
                {/* УНИВЕРСАЛЬНЫЙ РЕДАКТОР С ТИПИЗАЦИЕЙ */}
                <Editor 
                  content={block.body || ''} 
                  onChange={(html: string) => setBlocks(blocks.map(b => 
                    b.id === block.id ? { ...b, body: html } : b
                  ))}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* МОДАЛЬНОЕ ОКНО БИБЛИОТЕКИ */}
      {showMediaModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-5xl rounded-[40px] p-10 h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-black uppercase text-3xl tracking-tighter">Библиотека медиа</h3>
              <button onClick={() => setShowMediaModal(false)} className="text-gray-300 hover:text-black transition-colors">
                <X size={32}/>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 p-1">
                {mediaFiles.map(file => (
                  <button 
                    key={file.id} 
                    onClick={() => handleSelectMedia(file.id)}
                    className={`group relative aspect-square rounded-[24px] border-4 overflow-hidden bg-gray-50 transition-all ${
                      selectedFileId === file.id ? 'border-black scale-95 shadow-inner' : 'border-transparent hover:border-gray-200'
                    }`}
                  >
                    <img 
                      src={`${storageUrl}/storage/v1/object/public/media/${file.path}`} 
                      className="absolute inset-0 w-full h-full object-cover" 
                      alt={file.filename}
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <span className="text-white text-[10px] font-black uppercase tracking-widest">Выбрать</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={() => setShowMediaModal(false)} 
              className="mt-8 w-full py-5 bg-black text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-gray-800 transition-colors"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
}