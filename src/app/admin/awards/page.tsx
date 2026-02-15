'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Trash2, Plus, GripVertical, X, ImageIcon } from 'lucide-react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type Award = {
  id: string;
  title: string;
  festival: string;
  status: string | null;
  description: string | null;
  position: number;
  is_visible: boolean;
  media_id: string | null;
  media?: {
    id: string;
    filename: string;
  } | null;
};

export default function AdminAwardsPage() {
  const [awards, setAwards] = useState<Award[]>([]);
  const [editing, setEditing] = useState<Award | null>(null);
  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => { load(); }, []);

  async function load() {
    const res = await fetch('/api/admin/awards');
    const json = await res.json();
    setAwards(json.data || []);
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = awards.findIndex((a) => a.id === active.id);
    const newIndex = awards.findIndex((a) => a.id === over.id);
    const newArray = arrayMove(awards, oldIndex, newIndex);
    const updated = newArray.map((item, index) => ({ ...item, position: index }));
    setAwards(updated);
    await fetch('/api/admin/awards/reorder', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    });
  }

  async function remove(id: string) {
    if (!confirm('Удалить награду?')) return;
    await fetch('/api/admin/awards', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setAwards((prev) => prev.filter((a) => a.id !== id));
  }

  return (
    <div className="p-10 bg-white min-h-screen text-black">
      <div className="max-w-5xl mx-auto">
        <Link href="/admin" className="text-gray-400 flex items-center gap-2 mb-6 text-xs uppercase tracking-widest">
          <ArrowLeft size={14} /> Назад
        </Link>

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-black uppercase tracking-tight">Награды</h1>
          <button onClick={() => setEditing({} as Award)} className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl text-sm">
            <Plus size={16} /> Добавить
          </button>
        </div>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={awards.map((a) => a.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
              {awards.map((award) => (
                <SortableCard key={award.id} award={award} onDelete={remove} onEdit={() => setEditing(award)} />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {editing && <EditForm award={editing} onClose={() => setEditing(null)} onSaved={load} />}
      </div>
    </div>
  );
}

function SortableCard({ award, onDelete, onEdit }: { award: Award; onDelete: (id: string) => void; onEdit: () => void; }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: award.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  const publicUrl = award.media?.filename
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/${award.media.filename}`
    : null;

  return (
    <div ref={setNodeRef} style={style} className="border p-6 rounded-2xl bg-white shadow-sm flex justify-between items-center">
      <div className="flex items-center gap-4">
        {/* УБРАН grayscale */}
        <div className="w-12 h-12 flex-shrink-0 relative bg-gray-50 rounded-lg border flex items-center justify-center overflow-hidden">
          {publicUrl ? (
            <Image src={publicUrl} alt="" fill className="object-contain p-1" />
          ) : (
            <div className="text-[10px] text-gray-300">НЕТ</div>
          )}
        </div>
        <div {...attributes} {...listeners} className="cursor-grab text-gray-400"><GripVertical size={18} /></div>
        <div>
          <div className="font-bold text-lg leading-tight">{award.title}</div>
          <div className="text-sm text-gray-400 uppercase tracking-wider">{award.festival}</div>
        </div>
      </div>
      <div className="flex gap-3">
        <button onClick={onEdit} className="text-sm px-4 py-2 border rounded-xl hover:bg-gray-50">Редактировать</button>
        <button onClick={() => onDelete(award.id)} className="text-red-400 hover:text-red-600"><Trash2 size={18} /></button>
      </div>
    </div>
  );
}

function EditForm({ award, onClose, onSaved }: { award: Award; onClose: () => void; onSaved: () => void; }) {
  const [form, setForm] = useState({
    title: award.title || '',
    festival: award.festival || '',
    status: award.status || '',
    description: award.description || '',
    is_visible: award.is_visible ?? true,
    media_id: award.media_id || null,
  });
  const [mediaFiles, setMediaFiles] = useState<any[]>([]);
  const [showMediaModal, setShowMediaModal] = useState(false);

  useEffect(() => {
    fetch('/api/admin/media').then(res => res.json()).then(json => setMediaFiles(json.data || []));
  }, []);

  const selectedFile = mediaFiles.find(m => m.id === form.media_id);

  async function save() {
    const method = award.id ? 'PATCH' : 'POST';
    const body = award.id ? { id: award.id, ...form } : form;
    await fetch('/api/admin/awards', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    onSaved();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-xl rounded-3xl p-8 space-y-6 shadow-2xl">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-black uppercase tracking-tighter">{award.id ? 'Редактировать' : 'Новая награда'}</h2>
          <button onClick={onClose} className="text-gray-400"><X /></button>
        </div>

        <div className="space-y-4">
          <input className="w-full border-b py-2 focus:border-black outline-none transition-colors" placeholder="Название фильма/награды" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <input className="w-full border-b py-2 focus:border-black outline-none transition-colors" placeholder="Фестиваль" value={form.festival} onChange={(e) => setForm({ ...form, festival: e.target.value })} />
          <input className="w-full border-b py-2 focus:border-black outline-none transition-colors" placeholder="Статус (напр. Winner)" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} />
          
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-dashed">
             <div className="w-16 h-16 bg-white rounded-lg border flex items-center justify-center overflow-hidden relative">
                {selectedFile ? (
                  /* УБРАН grayscale */
                  <img src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/${selectedFile.filename}`} className="object-contain p-1" />
                ) : (
                  <ImageIcon className="text-gray-200" />
                )}
             </div>
             <div className="flex-1">
                <div className="text-xs font-bold uppercase text-gray-400 mb-1">Логотип</div>
                <button onClick={() => setShowMediaModal(true)} className="text-xs font-bold underline uppercase">Выбрать из библиотеки</button>
             </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.is_visible} onChange={(e) => setForm({ ...form, is_visible: e.target.checked })} className="w-4 h-4 accent-black" />
            <span className="text-sm font-medium">Опубликовано</span>
          </label>
          <div className="flex gap-4">
            <button onClick={onClose} className="px-6 py-2 text-sm font-bold uppercase">Отмена</button>
            <button onClick={save} className="bg-black text-white px-8 py-2 rounded-xl text-sm font-bold uppercase">Сохранить</button>
          </div>
        </div>

        {showMediaModal && (
          <div className="fixed inset-0 z-[110] bg-black/80 flex items-center justify-center p-10">
            <div className="bg-white w-full max-w-2xl rounded-3xl p-6 h-[500px] flex flex-col">
              <h3 className="font-black uppercase mb-4">Выберите логотип</h3>
              <div className="flex-1 overflow-y-auto grid grid-cols-4 gap-4 p-2">
                {mediaFiles.map(file => (
                  <button key={file.id} onClick={() => { setForm({ ...form, media_id: file.id }); setShowMediaModal(false); }} className={`aspect-square rounded-xl border-2 p-2 hover:border-black transition-all ${form.media_id === file.id ? 'border-black bg-gray-50' : 'border-transparent bg-gray-50'}`}>
                    {/* УБРАН grayscale */}
                    <img src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/${file.filename}`} className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
              <button onClick={() => setShowMediaModal(false)} className="mt-4 w-full py-3 bg-gray-100 rounded-xl font-bold uppercase text-xs">Закрыть</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}