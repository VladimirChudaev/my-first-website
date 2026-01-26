// app/admin/content/page.tsx

import Link from 'next/link';

export default function AdminContentPage() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Content</h1>

      <div className="border rounded-md p-4 text-sm text-muted-foreground">
        Content list is not implemented yet.
      </div>

      <div className="mt-4">
        <Link
          href="/admin/content/new"
          className="text-sm underline"
        >
          Create new block
        </Link>
      </div>
    </div>
  );
}
