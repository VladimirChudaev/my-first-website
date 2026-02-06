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
        // Дублируем массив для бесконечного скролла
        setPartners([...data, ...data]); 
      } catch (err) {
        console.error('Carousel error:', err);
      } finally {
        setLoading(false);
      }
    };
    loadPartners();
  }, []);

  if (loading || partners.length === 0) return <div className="h-24" />;

  return (
    <div className="overflow-hidden whitespace-nowrap py-10">
      <div className="inline-flex animate-scroll">
        {partners.map((partner, idx) => (
          <div key={`${partner.id}-${idx}`} className="mx-8 flex-shrink-0 w-32 h-16 relative">
            <img
              src={partner.imageUrl || '/placeholder.png'} 
              alt={partner.name}
              className="object-contain w-full h-full filter grayscale hover:grayscale-0 transition-all"
            />
          </div>
        ))}
      </div>
    </div>
  );
}