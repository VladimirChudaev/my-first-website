import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import InnerPageHeader from '@/app/components/InnerPageHeader';
import { getNewsBySlug } from '@/lib/news/service';

type Props = {
  params: Promise<{ slug: string }>;
};

/* =========================
   🔹 METADATA
========================= */

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data: newsItem } = await getNewsBySlug(slug);

  if (!newsItem || !newsItem.is_visible) {
    return { title: 'Новость не найдена' };
  }

  const description = newsItem.body?.replace(/<[^>]*>/g, '').slice(0, 160) || '';
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  
  const imageUrl = newsItem.media
    ? `${baseUrl}/storage/v1/object/public/${newsItem.media.bucket}/${newsItem.media.path}`
    : null;

  return {
    title: newsItem.title,
    description,
    openGraph: {
      title: newsItem.title,
      description,
      type: 'article',
      images: imageUrl ? [{ url: imageUrl }] : [],
    },
  };
}

/* =========================
   🔹 PAGE
========================= */

export default async function NewsSinglePage({ params }: Props) {
  const { slug } = await params;
  const { data: newsItem } = await getNewsBySlug(slug);

  if (!newsItem || !newsItem.is_visible) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const imageUrl = newsItem.media
    ? `${baseUrl}/storage/v1/object/public/${newsItem.media.bucket}/${newsItem.media.path}`
    : null;

  // Безопасное форматирование даты
  const formattedDate = newsItem.created_at 
    ? new Date(newsItem.created_at).toLocaleDateString('ru-RU')
    : '';

  return (
    <>
      <InnerPageHeader />

      <main className="bg-white min-h-screen pt-32 md:pt-40">
        <div className="max-w-3xl mx-auto px-6 pb-20">

          {imageUrl && (
            <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden mb-10 shadow-sm bg-gray-50">
              <img
                src={imageUrl}
                alt={newsItem.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <h1 className="text-3xl md:text-5xl font-light mb-6 leading-tight text-gray-900">
            {newsItem.title}
          </h1>

          <div className="text-sm text-gray-400 mb-10 pb-6 border-b border-gray-100">
            {formattedDate}
          </div>

          <article 
            className="prose prose-lg max-w-none text-gray-800 
              prose-p:my-6 prose-p:leading-relaxed 
              prose-headings:font-light prose-headings:mt-12 prose-headings:mb-6
              empty:prose-p:after:content-['\\00a0']"
            dangerouslySetInnerHTML={{ __html: newsItem.body || '' }}
          />

          <div className="mt-20">
            <Link 
              href="/news"
              className="text-sm font-medium hover:underline underline-offset-4 text-black"
            >
              ← Назад к списку
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}