import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import InnerPageHeader from '@/app/components/InnerPageHeader';
import { createClient } from '@/lib/server';

type Props = {
  params: { slug: string };
};

/* =========================
   🔹 METADATA
========================= */

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const supabase = await createClient();

  const { data: newsItem } = await supabase
    .from('news')
    .select(`
      title,
      body,
      is_visible,
      media:cover_image_id (
        bucket,
        path
      )
    `)
    .eq('slug', params.slug)
    .single();

  if (!newsItem || !newsItem.is_visible) {
    return { title: 'Новость не найдена' };
  }

  const media = newsItem.media?.[0] ?? null;

  const description =
    newsItem.body?.slice(0, 160).replace(/\n/g, ' ') || '';

  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  const imageUrl =
    media
      ? `${baseUrl}/storage/v1/object/public/${media.bucket}/${media.path}`
      : null;

  return {
    title: newsItem.title,
    description,
    openGraph: {
      title: newsItem.title,
      description,
      type: 'article',
      images: imageUrl
        ? [
            {
              url: imageUrl,
              width: 1200,
              height: 630,
            },
          ]
        : [],
    },
  };
}

/* =========================
   🔹 PAGE
========================= */

export default async function NewsSinglePage({ params }: Props) {
  const supabase = await createClient();

  const { data: newsItem } = await supabase
    .from('news')
    .select(`
      id,
      title,
      body,
      created_at,
      is_visible,
      media:cover_image_id (
        bucket,
        path,
        alt
      )
    `)
    .eq('slug', params.slug)
    .single();

  if (!newsItem || !newsItem.is_visible) {
    notFound();
  }

  const media = newsItem.media?.[0] ?? null;

  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  const imageUrl =
    media
      ? `${baseUrl}/storage/v1/object/public/${media.bucket}/${media.path}`
      : null;

  return (
    <>
      <InnerPageHeader />

      <main className="bg-white min-h-screen pt-16 md:pt-24">
        <div className="max-w-3xl mx-auto px-4 pb-20">

          {imageUrl && (
            <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden mb-10 shadow-sm">
              <img
                src={imageUrl}
                alt={media?.alt || newsItem.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <h1 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
            {newsItem.title}
          </h1>

          <div className="text-sm text-gray-400 mb-10">
            {new Date(newsItem.created_at).toLocaleDateString('ru-RU')}
          </div>

          <article className="prose max-w-none text-gray-800">
            {newsItem.body}
          </article>

        </div>
      </main>
    </>
  );
}
