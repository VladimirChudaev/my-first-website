import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import InnerPageHeader from '@/app/components/InnerPageHeader';
import { getNewsBySlug } from '@/lib/news/service';

type Props = { params: Promise<{ slug: string }>; };

export default async function NewsSinglePage({ params }: Props) {
  const { slug } = await params;
  const { data: newsItem, navigation } = await getNewsBySlug(slug);

  if (!newsItem || !newsItem.is_visible) notFound();

  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const imageUrl = newsItem.media ? `${baseUrl}/storage/v1/object/public/${newsItem.media.bucket}/${newsItem.media.path}` : null;
  const formattedDate = newsItem.created_at ? new Date(newsItem.created_at).toLocaleDateString('ru-RU') : '';

  return (
    <>
      <InnerPageHeader />
      <main className="bg-white min-h-screen pt-32 md:pt-40">
        <div className="max-w-3xl mx-auto px-6 pb-20">
          
          {/* ФОТО ИЗ БАКЕТА */}
          {imageUrl && (
            <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-sm bg-gray-50">
              <img src={imageUrl} alt={newsItem.title} className="w-full h-full object-cover" />
            </div>
          )}

          {/* КОНТЕНТ (РЕДАКТОР) */}
          <article 
            className="prose prose-lg max-w-none text-gray-800 news-body mt-2"
            dangerouslySetInnerHTML={{ __html: newsItem.body || '' }}
          />

          {/* ЗАГОЛОВОК И ДАТА ПОСЛЕ ФОТО И ПОДПИСИ */}
          <div className="mt-10">
            <h1 className="text-3xl md:text-5xl font-light mb-4 text-gray-900 leading-tight">
              {newsItem.title}
            </h1>
            <div className="text-sm text-gray-400 pb-6 border-b border-gray-100">
              {formattedDate}
            </div>
          </div>

          <style>{`
            /* СТИЛЬ ПОДПИСИ ПОД ФОТО */
            /* Если первая строка в редакторе сдвинута вправо — это подпись */
            .news-body p[style*="text-align: right"]:first-child {
              font-size: 0.75rem !important;
              color: #9ca3af !important;
              text-align: right !important;
              margin-top: 0.5rem !important;
              margin-bottom: 2rem !important;
              font-style: italic !important;
              line-height: 1 !important;
            }

            /* ЦИТАТА С КАВЫЧКОЙ */
            .news-body blockquote {
              position: relative;
              border-left: none !important;
              padding-left: 3.5rem !important;
              margin: 3.5rem 0 !important;
            }
            .news-body blockquote::before {
              content: "“";
              position: absolute;
              left: 0; top: -1.5rem;
              font-size: 7rem;
              color: #e5e7eb;
              font-family: serif;
              line-height: 1;
            }
            .news-body blockquote p {
              font-size: 1.4rem !important;
              font-style: italic !important;
              color: #4b5563 !important;
              line-height: 1.6 !important;
              margin: 0 !important;
            }
          `}</style>

          <div className="mt-20 border-t pt-10">
            <Link href="/news" className="text-xs uppercase font-bold tracking-widest text-black hover:underline">
              ← Все новости
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}