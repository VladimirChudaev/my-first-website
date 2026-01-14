'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Award {
  id: string;
  title: string;
  status: string;
  festival: string;
  logo: string;
}

const awardsData: Award[] = [
  {
    id: '1',
    title: '«Агитбригада»',
    status: 'участник конкурсного отбора в номинации «Фильмы на русском языке»',
    festival: 'Short Shot Fest (Россия, Москва)',
    logo: 'https://vtagency.ru/wp-content/uploads/2024/10/Frame-140.png',
  },
  {
    id: '2',
    title: '«Агитбригада»',
    status: 'Лучший европейский фильм',
    festival: 'The Reale Film Festival (Италия)',
    logo: 'https://vtagency.ru/wp-content/uploads/2024/10/Frame-147.png',
  },
  // остальные — без изменений
];

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
  const [awards] = useState<Award[]>(awardsData);
  const [[page, direction], setPage] = useState<[number, number]>([0, 0]);

  if (!awards.length) return null;

  const index =
    ((page % awards.length) + awards.length) % awards.length;

  useEffect(() => {
    const timer = setInterval(() => {
      setPage(([p]) => [p + 1, 1]);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

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
                src={awards[index].logo}
                alt="Award logo"
                className="w-64 h-64 object-contain grayscale hover:grayscale-0 transition"
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
