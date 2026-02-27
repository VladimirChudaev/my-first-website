import Link from 'next/link';
import InnerPageHeader from '@/app/components/InnerPageHeader';
import { getNewsList } from '@/lib/news/service';

export const dynamic = 'force-dynamic';

export default async function NewsPage() {
  const { data: news } = await getNewsList();

  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  // Фильтруем список, чтобы показывать только те новости, которые помечены как видимые
  const visibleNews = (news || []).filter(item => item.is_visible);

  return (
    <>
      <InnerPageHeader />

      <main className="bg-white min-h-screen pt-32 md:pt-40">
        <div className="max-w-5xl mx-auto px-6 pb-20">
          <h1 className="text-4xl md:text-5xl font-light mb-16 text-black">Новости</h1>
          
          <div className="space-y-12">
            {visibleNews.length > 0 ? (
              visibleNews.map((item) => {
                const media = item.media ?? null;

                const imageUrl =
                  media
                    ? `${baseUrl}/storage/v1/object/public/${media.bucket}/${media.path}`
                    : null;

                const createdAt = item.created_at
                  ? new Date(item.created_at).toLocaleDateString('ru-RU')
                  : '';

                // Очищаем текст от HTML-тегов для красивого анонса в списке
                const plainTextBody = item.body?.replace(/<[^>]*>/g, '') || '';

                return (
                  <Link
                    href={`/news/${item.slug}`}
                    key={item.id}
                    className="group block"
                  >
                    <div className="flex flex-col md:flex-row gap-8 items-center md:items-start bg-white rounded-3xl p-2 transition-all">

                      <div className="w-full md:w-[450px] aspect-[16/10] shrink-0 rounded-2xl overflow-hidden bg-gray-100 shadow-sm">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs uppercase tracking-widest">
                            Нет фото
                          </div>
                        )}
                      </div>

                      <div className="flex-1 py-2">
                        <h2 className="text-2xl md:text-3xl font-light mb-4 leading-tight group-hover:text-gray-600 transition-colors">
                          {item.title}
                        </h2>

                        <p className="text-gray-500 text-sm md:text-base leading-relaxed line-clamp-3 mb-6">
                          {plainTextBody}
                        </p>

                        <div className="text-[11px] font-mono text-gray-400 uppercase tracking-[0.2em]">
                          {createdAt}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <p className="text-gray-400 italic">На данный момент новостей нет.</p>
            )}
          </div>
        </div>
      </main>
    </>
  );
}