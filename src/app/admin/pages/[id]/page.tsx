// src/app/admin/pages/[id]/page.tsx
import { notFound } from 'next/navigation';

type Props = {
  params: { id: string };
};

async function getPage(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/admin/pages/${id}`,
    { cache: 'no-store' }
  );

  if (!res.ok) return null;
  return res.json();
}

export default async function AdminPageEditPage({ params }: Props) {
  const data = await getPage(params.id);

  if (!data) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-semibold">Edit page</h1>

      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Title
          </label>
          <input
            defaultValue={data.title ?? ''}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Slug
          </label>
          <input
            defaultValue={data.slug ?? ''}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Body
          </label>
          <textarea
            defaultValue={data.body ?? ''}
            className="w-full border rounded px-3 py-2 min-h-[200px]"
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
