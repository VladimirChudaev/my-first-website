'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Trash2, Plus, GripVertical, X, ImageIcon } from 'lucide-react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type CarouselItem = {
  id: string;
  media_id: string;
  position: number;
  is_visible: boolean;
  media?: {
    id: string;
    filename: string;
  } | null;
};

export default function AdminHomeCarouselPage() {
  const [items, setItems] = useState<CarouselItem[]>([]);
  const [editing, setEditing] = useState<CarouselItem | null>(null);
  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => { load(); }, []);

  async function load() {
    const res = await fetch('/api/admin/home-carousel');
    const json = await res.json();
    setItems(json.data || []);
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    
    const oldIndex = items.findIndex((a) => a.id === active.id);
    const newIndex = items.findIndex((a) => a.id === over.id);
    const newArray = arrayMove(items, oldIndex, newIndex);
    
    const updated = newArray.map((item, index) => ({ ...item, position: index }));
    setItems(updated);
    
    await fetch('/api/admin/home-carousel/reorder', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    });
  }

  async function remove(id: string) {
    if (!confirm('Удалить слайд из карусели?')) return;
    await fetch('/api/admin/home-carousel', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setItems((prev) => prev.filter((a) => a.id !== id));
  }

  return (
    <div className="p-10 bg-white min-h-screen text-black">
      <div className="max-w-5xl mx-auto">
        <Link href="/admin" className="text-gray-400 flex items-center gap-2 mb-6 text-xs uppercase tracking-widest hover:text-black transition-colors">
          <ArrowLeft size={14} /> Назад
        </Link>

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-black uppercase tracking-tight">Home Carousel</h1>
          <button onClick={() => setEditing({ is_visible: true } as CarouselItem)} className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl text-sm hover:bg-gray-800 transition-colors">
            <Plus size={16} /> Добавить слайд
          </button>
        </div>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items.map((a) => a.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
              {items.map((item) => (
                <SortableCard key={item.id} item={item} onDelete={remove} onEdit={() => setEditing(item)} />
              ))}
              {items.length === 0 && (
                <div className="py-20 border-2 border-dashed border-gray-100 rounded-3xl text-center text-gray-400 uppercase text-xs tracking-widest">
                  Нет добавленных слайдов
                </div>
              )}
            </div>
          </SortableContext>
        </DndContext>

        {editing && <EditForm item={editing} onClose={() => setEditing(null)} onSaved={load} />}
      </div>
    </div>
  );
}

function SortableCard({ item, onDelete, onEdit }: { item: CarouselItem; onDelete: (id: string) => void; onEdit: () => void; }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  const storageUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publicUrl = item.media?.filename && storageUrl
    ? `${storageUrl}/storage/v1/object/public/media/${item.media.filename}`
    : null;

  return (
    <div ref={setNodeRef} style={style} className="border p-6 rounded-2xl bg-white shadow-sm flex justify-between items-center transition-shadow hover:shadow-md">
      <div className="flex items-center gap-4">
        <div className="w-32 h-20 relative bg-gray-50 rounded-lg border overflow-hidden shrink-0 flex items-center justify-center">
          {publicUrl ? (
            <Image src={publicUrl} alt="" fill className="object-cover" unoptimized />
          ) : (
            <div className="text-[10px] text-gray-300 font-bold uppercase">Нет фото</div>
          )}
        </div>
        <div {...attributes} {...listeners} className="cursor-grab text-gray-400 hover:text-black p-2 transition-colors">
          <GripVertical size={18} />
        </div>
        <div>
          <div className="font-bold text-lg leading-tight">Слайд #{item.position + 1}</div>
          <div className={`text-[10px] uppercase font-bold tracking-widest mt-1 ${item.is_visible ? 'text-green-500' : 'text-gray-400'}`}>
            {item.is_visible ? 'Опубликован' : 'Скрыт'}
          </div>
        </div>
      </div>
      <div className="flex gap-3">
        <button onClick={onEdit} className="text-sm px-4 py-2 border rounded-xl hover:bg-gray-50 font-bold uppercase tracking-tighter transition-colors">Редактировать</button>
        <button onClick={() => onDelete(item.id)} className="text-gray-300 hover:text-red-600 transition-colors">
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
}

function EditForm({ item, onClose, onSaved }: { item: CarouselItem; onClose: () => void; onSaved: () => void; }) {
  const [form, setForm] = useState({
    media_id: item.media_id || null,
    is_visible: item.is_visible ?? true,
    position: item.position ?? 0
  });
  const [mediaFiles, setMediaFiles] = useState<any[]>([]);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const storageUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  useEffect(() => {
    fetch('/api/admin/media').then(res => res.json()).then(json => setMediaFiles(json.data || []));
  }, []);

  const selectedFile = mediaFiles.find(m => m.id === form.media_id);

  async function save() {
    if (!form.media_id) return alert('Выберите изображение');
    const method = item.id ? 'PATCH' : 'POST';
    const body = item.id ? { id: item.id, ...form } : form;
    
    await fetch('/api/admin/home-carousel', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    onSaved();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 text-black">
      <div className="bg-white w-full max-w-xl rounded-3xl p-8 space-y-6 shadow-2xl relative">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-black uppercase tracking-tighter">{item.id ? 'Редактировать' : 'Новый слайд'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors"><X /></button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
             <div className="w-24 h-16 bg-white rounded-lg border flex items-center justify-center overflow-hidden relative shadow-inner shrink-0">
                {selectedFile && storageUrl ? (
                  <img 
                    src={`${storageUrl}/storage/v1/object/public/media/${selectedFile.filename}`} 
                    className="w-full h-full object-cover" 
                    alt="Selected"
                  />
                ) : (
                  <ImageIcon className="text-gray-200" />
                )}
             </div>
             <div className="flex-1">
                <div className="text-[10px] font-black uppercase text-gray-400 mb-1 tracking-widest">Изображение</div>
                <button onClick={() => setShowMediaModal(true)} className="text-xs font-bold underline uppercase hover:text-gray-600 transition-colors">
                  {selectedFile ? 'Сменить из библиотеки' : 'Выбрать из библиотеки'}
                </button>
             </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input 
              type="checkbox" 
              checked={form.is_visible} 
              onChange={(e) => setForm({ ...form, is_visible: e.target.checked })} 
              className="w-5 h-5 accent-black rounded" 
            />
            <span className="text-sm font-bold uppercase tracking-tight group-hover:text-gray-600 transition-colors">Опубликовано</span>
          </label>
          <div className="flex gap-4">
            <button onClick={onClose} className="px-6 py-2 text-xs font-black uppercase tracking-widest hover:text-gray-400 transition-colors text-black">Отмена</button>
            <button onClick={save} className="bg-black text-white px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg active:scale-95">Сохранить</button>
          </div>
        </div>

        {showMediaModal && (
          <div className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-md flex items-center justify-center p-6">
            <div className="bg-white w-full max-w-4xl rounded-[32px] p-8 h-[80vh] flex flex-col shadow-2xl text-black">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-black uppercase text-2xl tracking-tighter">Выберите изображение</h3>
                <button onClick={() => setShowMediaModal(false)} className="text-gray-400 hover:text-black p-2"><X size={24}/></button>
              </div>
              
              <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-6 p-2">
                {mediaFiles.map(file => (
                  <button 
                    key={file.id} 
                    onClick={() => { setForm({ ...form, media_id: file.id }); setShowMediaModal(false); }} 
                    className={`group relative w-full aspect-video min-h-[120px] rounded-2xl border-4 overflow-hidden transition-all bg-gray-100 ${
                      form.media_id === file.id ? 'border-black' : 'border-transparent hover:border-gray-200'
                    }`}
                  >
                    <img 
                      src={`${storageUrl}/storage/v1/object/public/media/${file.filename}`} 
                      className="absolute inset-0 w-full h-full object-cover" 
                      alt={file.filename}
                    />
                    {form.media_id === file.id && (
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <div className="bg-white rounded-full p-2 text-black shadow-lg"><Plus className="rotate-45" size={20} /></div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setShowMediaModal(false)} 
                className="mt-6 w-full py-4 bg-black text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-gray-800 transition-colors"
              >
                Закрыть
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}