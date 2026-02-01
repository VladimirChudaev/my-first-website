// src/app/admin/media/[id]/page.tsx
import { notFound } from 'next/navigation';

type Props = {
  params: { id: string };
};

async function getMedia(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/admin/media/${id}`,
    { cache: 'no-store' }
  );

  if (!res.ok) return null;
  return res.json();
}

export default async function AdminMediaEditPage({ params }: Props) {
  const data = await getMedia(params.id);

  if (!data) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-semibold">Edit media</h1>

      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Filename
          </label>
          <input
            defaultValue={data.filename ?? ''}
            className="w-full border rounded px-3 py-2"
            disabled
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Type
          </label>
          <input
            defaultValue={data.type ?? ''}
            className="w-full border rounded px-3 py-2"
            disabled
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Size
          </label>
          <input
            defaultValue={data.size ?? ''}
            className="w-full border rounded px-3 py-2"
            disabled
          />
        </div>

        <div>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              defaultChecked={Boolean(data.is_visible)}
            />
            Visible
          </label>
        </div>
      </form>
    </div>
  );
}
