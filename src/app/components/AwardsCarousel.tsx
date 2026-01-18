'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mediaService } from '@/lib/services/MediaService';
import { MediaAsset } from '@/lib/media/types';

interface Award extends MediaAsset {
  title: string;
  status: string;
  festival: string;
}

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
};

export default function AwardsCarousel() {
  const [awards, setAwards] = useState<Award[]>([]);
  const [[page, direction], setPage] = useState<[number, number]>([0, 0]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAwards = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const awardsList = await mediaService.getByDomain('award');
        const filteredAwardsList = awardsList.filter((item: MediaAsset) =>
          item.filename.startsWith('av_')
        );
        const mappedAwards = await Promise.all(
          filteredAwardsList.map(async (asset) => {
            const url = asset.path ? await mediaService.getUrlByFilename('award', asset.filename) : undefined;
            return {
              ...asset,
              title: asset.title || '',
              status: asset.alt_text || '', // Используем alt_text для статуса, если есть
              festival: asset.link || '',   // Используем link для названия фестиваля, если есть
              url: url || '',              // URL изображения
            };
          })
        );
        setAwards(mappedAwards);
      } catch (error: any) {
        setError(error.message || 'Failed to load awards.');
      } finally {
        setIsLoading(false);
      }
    };

    loadAwards();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setPage(([p]) => [p + 1, 1]);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  if (isLoading) {
    return <section className="bg-white py-20 text-center">Loading awards...</section>;
  }

  if (error) {
    return <section className="bg-white py-20 text-center text-red-500">Error: {error}</section>;
  }

  if (!awards.length) return null;

  const index =
    ((page % awards.length) + awards.length) % awards.length;

  return (
    <section className="bg-white py-20 overflow-hidden">
      <div className="container mx-auto max-w-6xl relative h-[320px]">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={page}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.6 }}
            className="absolute inset-0 flex flex-col md:flex-row items-center gap-12"
          >
            <div className="md:w-1/2">
              <h2 className="text-3xl mb-4">{awards[index].title}</h2>
              <p className="text-gray-500 italic mb-6">
                — {awards[index].status}
              </p>
              <p className="font-bold uppercase text-sm">
                {awards[index].festival}
              </p>
            </div>

            <div className="md:w-1/2 flex justify-center">
              <img
                src={awards[index].url}
                alt={awards[index].alt_text || "Award logo"}
                className="w-64 h-64 object-contain grayscale hover:grayscale-0 transition"
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}