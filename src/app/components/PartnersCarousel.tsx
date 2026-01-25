'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getMediaMap } from '@/lib/media/media';
import { partnersData } from '@/data/partners';

interface Partner {
  name: string;
  url: string;
  logo: string;
}

export default function PartnersCarousel() {
  const [mediaUrls, setMediaUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadMedia = async () => {
      try {
        const map = await getMediaMap('partner');
        setMediaUrls(map);
      } catch (e) {
        console.error('Partners media load error:', e);
      }
    };

    loadMedia();
  }, []);

  const doubledPartners = [...partnersData, ...partnersData];

  return (
    <div className="bg-white py-12 overflow-hidden border-y border-gray-50">
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
            const fileName = partner.logo.split('/').pop() || '';
            const mediaUrl = mediaUrls[fileName];

            return (
              <a
                key={`${partner.name}-${index}`}
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="relative shrink-0 block grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
              >
                <Image
                  src={mediaUrl || partner.logo}
                  alt={partner.name}
                  width={128}
                  height={64}
                  className="h-16 w-auto object-contain max-w-none"
                />
              </a>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
