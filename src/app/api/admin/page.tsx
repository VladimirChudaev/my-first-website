// src/app/admin/page.tsx
export default function AdminDashboardPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded border">
          <div className="text-sm text-gray-500">News</div>
          <div className="text-2xl font-bold">—</div>
        </div>

        <div className="bg-white p-4 rounded border">
          <div className="text-sm text-gray-500">Pages</div>
          <div className="text-2xl font-bold">—</div>
        </div>

        <div className="bg-white p-4 rounded border">
          <div className="text-sm text-gray-500">Content blocks</div>
          <div className="text-2xl font-bold">—</div>
        </div>

        <div className="bg-white p-4 rounded border">
          <div className="text-sm text-gray-500">Media</div>
          <div className="text-2xl font-bold">—</div>
        </div>
      </div>
    </div>
  );
}
