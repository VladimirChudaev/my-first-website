import Link from 'next/link';
import InnerPageHeader from '@/app/components/InnerPageHeader';
import { createClient } from '@/lib/server';

export default async function NewsPage() {
  const supabase = await createClient();

  const { data: news } = await supabase
    .from('news')
    .select('*')
    .eq('is_visible', true)
    .order('created_at', { ascending: false });

  return (
    <>
      <InnerPageHeader />

      <main className="bg-white min-h-screen pt-16 md:pt-24">
        <div className="max-w-5xl mx-auto px-4 pb-20">
          <div className="space-y-12">
            {news?.map((item) => (
              <Link
                href={`/news/${item.slug}`}
                key={item.id}
                className="group block"
              >
                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start bg-white rounded-3xl p-2 transition-all">

                  <div className="w-full md:w-[450px] aspect-[16/10] shrink-0 rounded-2xl overflow-hidden bg-gray-100 shadow-sm">
                    {item.cover_image_url ? (
                      <img
                        src={item.cover_image_url}
                        alt=""
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                        НЕТ ФОТО
                      </div>
                    )}
                  </div>

                  <div className="flex-1 py-2">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4 leading-tight group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h2>

                    <p className="text-gray-500 text-sm md:text-base leading-relaxed line-clamp-4 mb-6">
                      {item.body}
                    </p>

                    <div className="text-[11px] font-mono text-gray-300 uppercase tracking-[0.2em]">
                      {new Date(item.created_at).toLocaleDateString('ru-RU')}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
