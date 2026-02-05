'use client';

import { useEffect, useState } from 'react';
import { PartnersService, PartnerDTO } from '@/lib/services/PartnersService';
import Image from 'next/image';

export default function PartnersCarousel() {
  const [partners, setPartners] = useState<PartnerDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPartners = async () => {
      try {
        const data = await PartnersService.getVisiblePartners();
        setPartners(data);
      } catch (err) {
        console.error('Failed to load partners for carousel:', err);
      } finally {
        setLoading(false);
      }
    };
    loadPartners();
  }, []);

  if (loading || partners.length === 0) {
    return <div className="h-20" />; // Заглушка, пока грузятся данные
  }

  return (
    <div className="flex space-x-8 animate-scroll">
      {partners.map((partner) => (
        <div key={partner.id} className="flex-shrink-0 w-32 h-16 relative">
          <img
            src={partner.logoUrl}
            alt={partner.name}
            className="object-contain w-full h-full filter grayscale hover:grayscale-0 transition-all"
          />
        </div>
      ))}
    </div>
  );
}