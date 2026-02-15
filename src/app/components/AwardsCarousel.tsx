'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Award = {
  id: string;
  title: string;
  festival: string;
  status: string;
  description: string | null;
  image_url: string | null; // Оставляем для совместимости, если где-то еще есть старые данные
  position: number;
  is_visible: boolean;
  media?: {
    filename: string;
  } | null;
};

export default function AwardsCarousel() {
  const [awards, setAwards] = useState<Award[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/awards', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch awards');

        const json = await res.json();
        const visibleAwards: Award[] =
          json.data?.filter((a: Award) => a.is_visible) ?? [];

        setAwards(visibleAwards);
      } catch (error) {
        console.error('Ошибка загрузки наград:', error);
        setAwards([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  useEffect(() => {
    if (awards.length <= 1) return;
    const timer = setInterval(() => setPage((p) => p + 1), 6000);
    return () => clearInterval(timer);
  }, [awards.length]);

  if (loading || !awards.length) return null;

  const current = awards[page % awards.length];

  // Формируем URL картинки: приоритет новому полю media.filename
  const displayImageUrl = current.media?.filename
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/${current.media.filename}`
    : current.image_url;

  return (
    <section className="bg-white py-20 border-t border-gray-100 text-black overflow-hidden">
      <div className="max-w-6xl mx-auto px-8">
        <div className="relative min-h-[400px] flex items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.6 }}
              className="w-full flex flex-col md:flex-row items-center gap-12"
            >
              <div className="flex-1 space-y-6">
                <h3 className="text-4xl font-black uppercase tracking-tighter leading-[0.9]">
                  {current.title}
                </h3>

                <div className="space-y-1">
                  <p className="text-sm font-bold uppercase tracking-[0.2em]">
                    {current.festival}
                  </p>
                  <p className="text-gray-400 italic text-sm">
                    — {current.status}
                  </p>
                </div>

                {current.description && (
                  <p className="text-lg text-gray-600 leading-relaxed italic border-t border-gray-50 pt-6">
                    {current.description}
                  </p>
                )}
              </div>

              {displayImageUrl && (
                <div className="w-72 h-72 flex-shrink-0 flex items-center justify-center">
                  <img
                    src={displayImageUrl}
                    alt={current.title}
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      console.error(
                        'Ошибка загрузки картинки:',
                        e.currentTarget.src
                      );
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}