// src/app/components/PartnersCarousel.tsx
'use client';

import { useEffect, useState } from 'react';
import { PartnersService, PartnerDTO } from '@/lib/services/PartnersService';

export default function PartnersCarousel() {
  const [partners, setPartners] = useState<PartnerDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPartners = async () => {
      try {
        const data = await PartnersService.getVisible();
        // Дублируем для бесшовности
        setPartners([...data, ...data]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadPartners();
  }, []);

  if (loading || partners.length === 0) return <div className="h-24" />;

  return (
    <div className="overflow-hidden w-full bg-white py-4">
      <div 
        className="flex w-max animate-scroll"
        style={{ animation: 'scroll 30s linear infinite' }}
      >
        {partners.map((partner, idx) => (
          <div key={`${partner.id}-${idx}`} className="mx-12 w-32 h-16 flex-shrink-0">
            <img
              src={partner.imageUrl || '/placeholder.png'} 
              alt={partner.name}
              className="object-contain w-full h-full grayscale hover:grayscale-0 transition-all"
            />
          </div>
        ))}
      </div>
      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          display: flex;
          width: max-content;
        }
      `}</style>
    </div>
  );
}