'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { mediaService } from '@/lib/services/MediaService';
import { partnersData } from '@/data/partners';

interface Partner {
  name: string;
  url: string;
  logo: string;
}

export default function PartnersCarousel() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [mediaUrls, setMediaUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchPartnersAndMedia = async () => {
      try {
        // Используем статические данные из partnersData
        setPartners(partnersData);

        // Попытка получить медиа-данные из новой системы
        try {
          const mediaMap = await mediaService.getMediaMap('partner');
          setMediaUrls(mediaMap);
        } catch (mediaError: any) {
          console.error('Error fetching media:', mediaError?.message || mediaError);
          // Если не удалось получить медиа-данные из новой системы, используем локальные пути из partnersData
          const fallbackMediaMap: Record<string, string> = {};
          partnersData.forEach(partner => {
            // partner.logo уже содержит правильный путь к изображению, начинающийся с /
            fallbackMediaMap[partner.logo.split('/').pop() || partner.logo] = partner.logo;
          });
          setMediaUrls(fallbackMediaMap);
        }
      } catch (error: any) {
        console.error('Error fetching partners:', error?.message || error);
        // Если произошла ошибка, используем fallback данные
        setPartners(partnersData);
        const fallbackMediaMap: Record<string, string> = {};
        partnersData.forEach(partner => {
          fallbackMediaMap[partner.logo.split('/').pop() || partner.logo] = partner.logo;
        });
        setMediaUrls(fallbackMediaMap);
      } finally {
        setLoading(false);
      }
    };

    fetchPartnersAndMedia();
  }, []);

  // Дублируем массив для бесшовной прокрутки
  const doubledPartners = [...partners, ...partners];

  if (loading) {
    return (
      <div className="bg-white py-12 overflow-hidden border-y border-gray-50">
        <div className="container mx-auto px-4 mb-8">
          <h3 className="text-gray-400 text-sm font-medium tracking-widest uppercase">
            Наши партнеры
          </h3>
        </div>
        <div className="flex justify-center items-center h-40">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white py-12 overflow-hidden border-y border-gray-50">
      <div className="container mx-auto px-4 mb-8">
        {/* Заголовок "Наши партнеры" удален по запросу пользователя */}
      </div>

      <div className="relative flex">
        <motion.div
          className="flex flex-nowrap gap-16 items-center"
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            duration: 30,
            ease: 'linear',
            repeat: Infinity,
          }}
        >
          {doubledPartners.map((partner, index) => {
            // Ищем соответствующий URL в mediaUrls, используя имя файла из пути партнера
            const fileName = partner.logo.split('/').pop() || partner.logo;
            const mediaUrl = mediaUrls[fileName];
            
            return (
              <a
                key={`${partner.name}-${index}`}
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="relative shrink-0 block grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
              >
                {mediaUrl ? (
                  <Image
                    src={mediaUrl}
                    alt={partner.name}
                    width={128}
                    height={64}
                    className="h-16 w-auto object-contain max-w-none"
                  />
                ) : (
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    width={128}
                    height={64}
                    className="h-16 w-auto object-contain max-w-none"
                  />
                )}
              </a>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
