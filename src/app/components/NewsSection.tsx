'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { HiOutlineArrowRight } from 'react-icons/hi';

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  body: string;
  created_at: string;
  cover_image?: {
    filename: string;
  };
}

interface NewsSectionProps {
  content?: {
    title: string;
    is_visible: boolean;
  };
}

export default function NewsSection({ content }: NewsSectionProps) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Если в админке блок выключен, вообще ничего не рендерим
  if (content && !content.is_visible) return null;

  useEffect(() => {
    fetch('/api/news')
      .then((res) => res.json())
      .then((json) => {
        setNews((json.data || []).slice(0, 2));
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading || news.length === 0) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const months = [
      'ЯНВ', 'ФЕВ', 'МАР', 'АПР', 'МАЙ', 'ИЮН',
      'ИЮЛ', 'АВГ', 'СЕН', 'ОКТ', 'НОЯ', 'ДЕК'
    ];
    return { day, month: months[date.getMonth()] };
  };

  return (
    <section className="bg-white py-20 border-t border-gray-100">
      <div className="container mx-auto px-6 lg:px-20">
        
        <div className="flex flex-row justify-between items-end mb-12 gap-6">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-black">
            {content?.title || 'Новости'} 
          </h2>
          <Link 
            href="/news" 
            className="group flex items-center gap-2 border border-gray-200 rounded-full px-6 py-2 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all duration-300 mb-1"
          >
            Больше новостей
            <HiOutlineArrowRight className="text-lg group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
          {news.map((item) => {
            const { day, month } = formatDate(item.created_at);
            const filename = item.cover_image?.filename;
            const imageUrl = filename 
              ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/${filename}`
              : null;

            return (
              <Link key={item.id} href={`/news/${item.slug}`} className="group">
                <div className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.04)] group-hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-500 h-full flex flex-col">
                  
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <div className="absolute bottom-0 left-0 z-10 bg-[#0047FF] text-white w-16 h-16 flex flex-col items-center justify-center font-bold">
                      <span className="text-2xl leading-none">{day}</span>
                      <span className="text-[9px] tracking-widest">{month}</span>
                    </div>
                    
                    {imageUrl && (
                      <img 
                        src={imageUrl} 
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    )}
                  </div>
                  
                  <div className="p-10 flex flex-col flex-grow bg-white">
                    <h3 className="text-2xl md:text-3xl font-bold mb-4 leading-tight text-black group-hover:text-[#0047FF] transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    
                    <div 
                      className="text-gray-500 text-base font-light line-clamp-3 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: item.body }}
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}