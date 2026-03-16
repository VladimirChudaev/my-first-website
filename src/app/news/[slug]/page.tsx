import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import InnerPageHeader from '@/app/components/InnerPageHeader';
import { getNewsBySlug } from '@/lib/news/service';

interface NavigationItem {
  slug: string;
  title: string;
}

interface NewsItem {
  is_visible: boolean;
  media?: {
    bucket: string;
    path: string;
  };
  title: string;
  body: string;
  created_at: string;
}

type Props = { params: Promise<{ slug: string }>; };

export default async function NewsSinglePage({ params }: Props) {
  const { slug } = await params;
  
  const response = await getNewsBySlug(slug);
  const newsItem = response.data as NewsItem;
  const navigation = response.navigation as { prev: NavigationItem | null; next: NavigationItem | null };

  if (!newsItem || !newsItem.is_visible) notFound();

  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const imageUrl = newsItem.media ? `${baseUrl}/storage/v1/object/public/${newsItem.media.bucket}/${newsItem.media.path}` : null;
  const formattedDate = newsItem.created_at ? new Date(newsItem.created_at).toLocaleDateString('ru-RU') : '';

  return (
    <>
      <InnerPageHeader />
      <main className="bg-white min-h-screen pt-32 md:pt-40">
        <div className="max-w-3xl mx-auto px-6 pb-20">
          
          {/* 1. ЗАГОЛОВОК И ДАТА (ТЕПЕРЬ СВЕРХУ) */}
          <div className="mb-10">
            <h1 className="text-3xl md:text-5xl font-light mb-4 text-gray-900 leading-tight">
              {newsItem.title}
            </h1>
            <div className="text-sm text-gray-400">
              {formattedDate}
            </div>
          </div>

          {/* 2. ФОТО ИЗ БАКЕТА */}
          {imageUrl && (
            <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-sm bg-gray-50 mb-4">
              <img src={imageUrl} alt={newsItem.title} className="w-full h-full object-cover" />
            </div>
          )}

          {/* 3. КОНТЕНТ (ТЕКСТ + ПОДПИСЬ + ЦИТАТЫ) */}
          <article 
            className="prose prose-lg max-w-none text-gray-800 news-body"
            dangerouslySetInnerHTML={{ __html: newsItem.body || '' }}
          />

          <style>{`
            .news-body p[style*="text-align: right"]:first-child {
              font-size: 0.75rem !important;
              color: #9ca3af !important;
              text-align: right !important;
              margin-top: 0.5rem !important;
              margin-bottom: 2rem !important;
              font-style: italic !important;
              line-height: 1 !important;
            }
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

          {/* 4. НАВИГАЦИЯ (НИЖНИЙ БЛОК) */}
          <div className="mt-20 border-t pt-10 flex justify-between items-start gap-8">
            <div className="flex-1">
              {navigation?.prev && (
                <Link href={`/news/${navigation.prev.slug}`} className="group flex flex-col items-start text-left">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2">Предыдущий</span>
                  <span className="text-sm font-medium text-black group-hover:underline leading-snug">
                    ← {navigation.prev.title}
                  </span>
                </Link>
              )}
            </div>

            <div className="shrink-0 pt-4">
              <Link href="/news" className="text-[10px] uppercase font-bold tracking-[0.2em] text-black hover:opacity-60 transition-opacity">
                Все новости
              </Link>
            </div>

            <div className="flex-1 text-right">
              {navigation?.next && (
                <Link href={`/news/${navigation.next.slug}`} className="group flex flex-col items-end text-right">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2">Следующий</span>
                  <span className="text-sm font-medium text-black group-hover:underline leading-snug">
                    {navigation.next.title} →
                  </span>
                </Link>
              )}
            </div>
          </div>

        </div>
      </main>
    </>
  );
}