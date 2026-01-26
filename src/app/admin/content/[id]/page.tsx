// app/admin/content/[id]/page.tsx

import { notFound } from 'next/navigation';

export default function AdminContentEditorPage({
  params,
}: {
  params: { id: string };
}) {
  if (!params.id) {
    notFound();
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">
        Content editor
      </h1>

      <div className="border rounded-md p-4 text-sm text-muted-foreground">
        Editing block: <strong>{params.id}</strong>
        <br />
        Editor is not implemented yet.
      </div>
    </div>
  );
}
