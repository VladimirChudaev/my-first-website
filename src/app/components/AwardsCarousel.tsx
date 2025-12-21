'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const awards = [
  {
    title: "«Агитбригада»",
    status: "участник конкурсного отбора в номинации «Фильмы на русском языке»",
    festival: "Short Shot Fest (Россия, Москва)",
    logo: "https://vtagency.ru/wp-content/uploads/2024/10/Frame-140.png",
  },
  {
    title: "«Агитбригада»",
    status: "победитель в номинации «Лучший европейский фильм»",
    festival: "The Reale film festival (Италия)",
    logo: "https://vtagency.ru/wp-content/uploads/2024/10/Frame-147.png",
  },
  {
    title: "«Агитбригада»",
    status: "победитель в номинации «Лучший фильм о войне»",
    festival: "The Bangkok Movie Awards (Таиланд)",
    logo: "https://vtagency.ru/wp-content/uploads/2024/10/Frame-139.png",
  },
  {
    title: "«Агитбригада»",
    status: "победитель в номинации «Лучший военный фильм»",
    festival: "HALO International Film Festival HIFF (Россия, Санкт-Петербург)",
    logo: "https://vtagency.ru/wp-content/uploads/2024/10/Frame-145.png"
  },
  {
    title: "«Агитбригада»",
    status: "победитель в номинации «Лучший международный короткометражный фильм»",
    festival: "TAMIZHAGAM INTERNATIONAL FILM FESTIVAL (Индия)",
    logo: "https://vtagency.ru/wp-content/uploads/2024/10/Frame-142.png"
  },
  {
    title: "«Угрюмка»",
    status: "победитель в номинации «Короткий метр»",
    festival: "The Bangkok Movie Awards (Таиланд)",
    logo: "https://vtagency.ru/wp-content/uploads/2024/10/Frame-147.png"
  },
  {
    title: "«Угрюмка»",
    status: "участник конкурсной программы в категории Social Short Film",
    festival: "Maracay International Film & Video Festival (Венесуэла)",
    logo: "https://vtagency.ru/wp-content/uploads/2024/10/Frame-149.png"
  }
];

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 500 : -500,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 500 : -500,
    opacity: 0,
  }),
};

export default function AwardsCarousel() {
  const [[page, direction], setPage] = useState([0, 0]);
  const awardIndex = (((page % awards.length) + awards.length) % awards.length);

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  useEffect(() => {
    const interval = setInterval(() => paginate(1), 6000);
    return () => clearInterval(interval);
  }, [page]);

  return (
    <section className="bg-white py-20 relative overflow-hidden min-h-[450px] flex items-center">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="relative h-[300px]">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={page}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.4 }
              }}
              className="absolute w-full flex flex-col md:flex-row items-center justify-between gap-12"
            >
              {/* Левая часть: Текст */}
              <div className="w-full md:w-1/2 text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-4 tracking-tight">
                  {awards[awardIndex].title}
                </h2>
                <p className="text-gray-500 text-lg mb-6 italic leading-relaxed">
                  — {awards[awardIndex].status}
                </p>
                <div className="w-16 h-[1px] bg-black mb-4 mx-auto md:mx-0"></div>
                <p className="text-black font-bold uppercase tracking-widest text-sm">
                  {awards[awardIndex].festival}
                </p>
              </div>

              {/* Правая часть: Логотип */}
              <div className="w-full md:w-1/2 flex justify-center md:justify-end">
                <div className="relative w-64 h-64">
                  <img 
                    src={awards[awardIndex].logo} 
                    alt="Award Logo"
                    className="w-full h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-700"
                  />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Индикаторы */}
        <div className="flex justify-center gap-3 mt-12">
          {awards.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setPage([idx, idx > awardIndex ? 1 : -1])}
              className={`h-1.5 transition-all duration-300 rounded-full ${
                idx === awardIndex ? 'w-8 bg-black' : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}