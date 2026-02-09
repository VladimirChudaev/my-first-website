import Link from 'next/link';
import { createClient } from '@/lib/server';

export default async function AdminMediaListPage() {
  const supabase = await createClient();

  const { data: mediaItems, error } = await supabase
    .from('media')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="pt-24 px-8 space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Media Library</h1>
        <Link
          href="/admin/media/new"
          className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm transition-colors shadow-sm"
        >
          + Add Media
        </Link>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 border-b text-gray-600 uppercase text-xs tracking-wider">
            <tr>
              <th className="p-4 font-semibold">Preview</th>
              <th className="p-4 font-semibold">Title / Filename</th>
              <th className="p-4 font-semibold">Category</th>
              <th className="p-4 font-semibold text-center">Status</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {mediaItems && mediaItems.length > 0 ? (
              mediaItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 w-24">
                    <div className="w-16 h-10 rounded border bg-gray-100 overflow-hidden shadow-sm">
                      <img 
                        src={`https://hdrxoowpnhrschlonivc.supabase.co/storage/v1/object/public/${item.bucket}/${item.filename}`}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-gray-900">{item.title || 'Untitled'}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{item.filename}</div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 bg-gray-100 border rounded-full text-[10px] font-bold text-gray-500">
                      {item.category}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    {item.is_visible ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-[11px] font-medium bg-green-50 text-green-700 border border-green-200">
                        Visible
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-[11px] font-medium bg-gray-50 text-gray-500 border border-gray-200">
                        Hidden
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <Link
                      href={`/admin/media/${item.id}`}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 shadow-sm transition-all"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-12 text-center text-gray-400 italic">
                  No media items found in the database.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}