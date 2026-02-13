'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/client';
import { getMediaUrl } from '@/lib/media/media';

interface Award {
  id: string;
  title: string;
  status: string;
  festival: string;
  description: string;
  url: string;
  alt_text: string;
}

export default function AwardsCarousel() {
  const [awards, setAwards] = useState<Award[]>([]);
  const [intro, setIntro] = useState({ title: '', body: '', is_visible: true });
  const [[page, direction], setPage] = useState<[number, number]>([0, 0]);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        const { data: assets } = await supabase
          .from('media')
          .select('id, title, alt_text, link, description, filename, path, is_visible')
          .eq('is_visible', true)
          .like('filename', 'av_%');

        const resHome = await fetch('/api/pages/home');
        const jsonHome = await resHome.json();
        const introData = jsonHome.data?.find((b: any) => b.section_key === 'awards_intro');
        
        if (isMounted && introData) {
          setIntro({ 
            title: introData.title || '', 
            body: introData.body || '', 
            is_visible: introData.is_visible !== false 
          });
        }

        const mapped: Award[] = await Promise.all(
          (assets || []).map(async (a) => ({
            id: a.id,
            title: a.title || '',
            status: a.alt_text || '',
            festival: a.link || '',
            description: a.description || '',
            alt_text: a.alt_text || '',
            url: a.path ? await getMediaUrl(a.path) : '',
          }))
        );

        if (isMounted) setAwards(mapped);
      } catch (e) {
        console.error(e);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    loadData();
    return () => { isMounted = false; };
  }, [supabase]);

  useEffect(() => {
    if (awards.length < 2) return;
    const timer = setInterval(() => setPage(([p]) => [p + 1, 1]), 6000);
    return () => clearInterval(timer);
  }, [awards.length]);

  if (isLoading || !awards.length) return null;

  const index = ((page % awards.length) + awards.length) % awards.length;

  return (
    <section className="bg-white py-16 md:py-24 overflow-hidden">
      <div className="mx-auto w-full max-w-5xl px-8">
        
        {/* Заголовок секции */}
        {intro.is_visible && (
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-black mb-3 uppercase tracking-tighter text-gray-900">
              {intro.title}
            </h2>
            <p className="text-base text-gray-400 font-light max-w-xl mx-auto italic">
              {intro.body}
            </p>
          </div>
        )}

        {/* СТАБИЛЬНЫЙ КОНТЕЙНЕР: 
            min-h фиксирует высоту, чтобы страница не дергалась при смене слайдов.
        */}
        <div className="relative min-h-[550px] md:min-h-[420px] w-full">
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              // absolute гарантирует, что один слайд не "выталкивает" другой физически
              className="absolute inset-0 w-full flex flex-col md:flex-row items-stretch justify-center gap-12 md:gap-20"
            >
              
              {/* Левая часть: Текст */}
              <div className="flex-1 flex flex-col justify-between py-2 text-center md:text-left">
                <div className="space-y-4">
                  <h3 className="text-xl md:text-2xl font-black text-gray-900 leading-tight uppercase">
                    {awards[index].title}
                  </h3>
                  <div className="space-y-1">
                    <p className="text-blue-600 font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs">
                      {awards[index].festival}
                    </p>
                    <p className="text-gray-400 italic text-sm md:text-base">
                      — {awards[index].status}
                    </p>
                  </div>
                </div>

                {awards[index].description && (
                  <div className="pt-6 border-t border-gray-100 mt-8">
                    <p className="text-gray-600 text-sm md:text-lg leading-relaxed font-medium italic opacity-80">
                      «{awards[index].description}»
                    </p>
                  </div>
                )}
              </div>

              {/* Правая часть: Логотип */}
              <div className="w-full md:w-[320px] lg:w-[400px] flex-shrink-0 flex items-center justify-center">
                <div className="w-full h-full min-h-[250px] flex items-center justify-center bg-gray-50/30 rounded-lg p-8">
                  <img
                    src={awards[index].url}
                    alt={awards[index].alt_text || 'Award'}
                    className="max-w-full max-h-[300px] object-contain grayscale hover:grayscale-0 transition-all duration-700 select-none"
                  />
                </div>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}