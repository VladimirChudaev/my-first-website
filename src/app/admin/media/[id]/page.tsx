'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState, use } from 'react'; // Добавили use
import { createClient } from '@/lib/client';

type Props = {
  params: Promise<{ id: string }>; // Теперь это Promise
};

export default function AdminMediaEditPage({ params }: Props) {
  const router = useRouter();
  const supabase = createClient();
  
  // Разворачиваем params с помощью React.use()
  const { id } = use(params);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    credits: '',
    is_visible: true
  });

  useEffect(() => {
    async function loadMedia() {
      const { data, error } = await supabase
        .from('media')
        .select('*')
        .eq('id', id) // Используем уже развернутый id
        .single();

      if (data) {
        setFormData({
          title: data.title || '',
          description: data.description || '',
          credits: data.credits || '',
          is_visible: data.is_visible ?? true
        });
      }
      setLoading(false);
    }
    loadMedia();
  }, [id, supabase]); // Зависимость теперь просто id

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const { error } = await supabase
      .from('media')
      .update({
        title: formData.title,
        description: formData.description,
        credits: formData.credits,
        is_visible: formData.is_visible
      })
      .eq('id', id);

    setSaving(false);
    if (!error) {
      router.push('/admin/media');
      router.refresh();
    } else {
      alert('Error saving: ' + error.message);
    }
  }

  async function handleDelete() {
    if (!confirm('Delete media file?')) return;
    await fetch(`/api/admin/media/${id}`, { method: 'DELETE' });
    router.push('/admin/media');
  }

  if (loading) return <div className="pt-24 px-8 text-gray-500 font-medium">Loading project data...</div>;

  return (
    <div className="pt-24 px-8 pb-12 max-w-4xl space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Edit Media Item</h1>
          <p className="text-sm text-gray-400 font-mono mt-1">ID: {id}</p>
        </div>
        <Link href="/admin/media" className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
          ← Back to Library
        </Link>
      </div>

      <form onSubmit={handleSave} className="bg-white border rounded-xl p-8 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Project Title</label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Угрюм-река"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Credits (Director, DOP)</label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={formData.credits}
              onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
              placeholder="Who made this?"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Description</label>
          <textarea
            rows={6}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Write a brief summary of the project..."
          />
        </div>

        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
          <input
            type="checkbox"
            id="visible"
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
            checked={formData.is_visible}
            onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })}
          />
          <label htmlFor="visible" className="text-sm font-medium text-gray-700 cursor-pointer">
            Publicly visible on website
          </label>
        </div>

        <div className="pt-6 flex items-center justify-between gap-4 border-t">
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-300 shadow-md transition-all"
            >
              {saving ? 'Saving changes...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2.5 bg-gray-100 text-gray-600 font-medium rounded-lg hover:bg-gray-200 transition-all"
            >
              Cancel
            </button>
          </div>

          <button
            type="button"
            onClick={handleDelete}
            className="text-sm font-semibold text-red-500 hover:text-red-700 transition-colors"
          >
            Delete Item
          </button>
        </div>
      </form>
    </div>
  );
}