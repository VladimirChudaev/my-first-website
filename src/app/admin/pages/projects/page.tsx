// app/admin/pages/projects/page.tsx

'use client';

import { useEffect, useState } from 'react';

export default function AdminProjectsPage() {
  const [blocks, setBlocks] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/pages/projects')
      .then((r) => r.json())
      .then((r) => setBlocks(r.data ?? []));
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Projects page blocks</h1>

      {blocks.map((b) => (
        <div
          key={b.id}
          className="border rounded p-3 flex justify-between items-center"
        >
          <div>
            <div className="font-medium">{b.title}</div>
            <div className="text-xs text-muted-foreground">
              visible: {String(b.is_visible)}
            </div>
          </div>
          <div className="text-xs">pos: {b.position}</div>
        </div>
      ))}
    </div>
  );
}
