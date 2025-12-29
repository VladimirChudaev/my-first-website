'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { partnersData } from '@/data/partners'; // Импортируем данные из общего файла

// Дублируем массив для бесшовной прокрутки
const doubledPartners = [...partnersData, ...partnersData]; // Используем импортированные данные

export default function PartnersCarousel() { 
  return (
    <div className="bg-white py-12 overflow-hidden border-y border-gray-50">
      <div className="container mx-auto px-4 mb-8">
        <h3 className="text-gray-400 text-sm font-medium tracking-widest uppercase">Наши партнеры</h3>
      </div>
      
      <div className="relative flex">
        <motion.div
          className="flex flex-nowrap gap-16 items-center"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 30,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          {doubledPartners.map((partner, index) => ( // Используем импортированный и дублированный массив
            <a
              key={index}
              href={partner.url} // Используем URL из данных
              target="_blank"
              rel="noopener noreferrer"
              className="relative shrink-0 block grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
            >
              <img // Используем тег img напрямую, так как пути к логотипам из public/
                src={partner.logo} // Используем путь к логотипу из данных
                alt={partner.name}
                className="h-16 w-auto object-contain"
              />
            </a>
          ))}
        </motion.div>
      </div>
    </div>
  );
}