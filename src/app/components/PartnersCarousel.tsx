'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { PartnersService, PartnerDTO } from '@/lib/services/PartnersService';

export default function PartnersCarousel() {
  const [partners, setPartners] = useState<PartnerDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPartners() {
      try {
        const data = await PartnersService.getVisible();
        if (data && data.length > 0) {
          // Дублируем для плавности
          setPartners([...data, ...data, ...data]);
        }
      } catch (error) {
        console.error('Error loading partners:', error);
      } finally {
        setLoading(false);
      }
    }
    loadPartners();
  }, []);

  if (loading || partners.length === 0) return null;

  return (
    <section className="py-6 bg-white overflow-hidden">
      {/* Заголовок удален */}
      <div className="relative flex overflow-hidden group">
        <div className="flex animate-marquee whitespace-nowrap items-center">
          {partners.map((partner, idx) => (
            <div 
              key={`${partner.id}-${idx}`} 
              className="mx-12 relative w-32 h-20 grayscale hover:grayscale-0 transition-all duration-300 flex-shrink-0"
            >
              {partner.imageUrl && (
                <Image
                  src={partner.imageUrl}
                  alt={partner.name || 'Partner'}
                  fill
                  className="object-contain"
                  sizes="128px"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 40s linear infinite;
        }
        .group:hover .animate-marquee {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}