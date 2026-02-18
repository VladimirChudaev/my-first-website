import { notFound } from 'next/navigation';
import InnerPageHeader from '@/app/components/InnerPageHeader';
import { createClient } from '@/lib/server';

type Props = {
  params: { slug: string };
};

export default async function NewsSinglePage({ params }: Props) {
  const supabase = await createClient();

  const { data: newsItem } = await supabase
    .from('news')
    .select('id, title, body, cover_image_url, created_at, is_visible')
    .eq('slug', params.slug)
    .single();

  if (!newsItem || !newsItem.is_visible) {
    notFound();
  }

  return (
    <>
      <InnerPageHeader />

      <main className="bg-white min-h-screen pt-16 md:pt-24">
        <div className="max-w-3xl mx-auto px-4 pb-20">

          {/* Обложка */}
          {newsItem.cover_image_url && (
            <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden mb-10 shadow-sm">
              <img
                src={newsItem.cover_image_url}
                alt={newsItem.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Заголовок */}
          <h1 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
            {newsItem.title}
          </h1>

          {/* Дата */}
          <div className="text-sm text-gray-400 mb-10">
            {new Date(newsItem.created_at).toLocaleDateString('ru-RU')}
          </div>

          {/* Текст */}
          <article className="prose max-w-none text-gray-800">
            {newsItem.body}
          </article>

        </div>
      </main>
    </>
  );
}
