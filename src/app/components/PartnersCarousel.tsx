'use client';

import { useEffect, useState } from 'react';
import { PartnersService, PartnerDTO } from '@/lib/services/PartnersService';

export default function PartnersCarousel() {
  const [partners, setPartners] = useState<PartnerDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPartners = async () => {
      try {
        // ИСПОРАВЛЕНО: используем корректный метод из PartnersService
        const data = await PartnersService.getVisible();
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
            // ИСПРАВЛЕНО: используем imageUrl из PartnerDTO
            src={partner.imageUrl || '/placeholder.png'} 
            alt={partner.name}
            className="object-contain w-full h-full filter grayscale hover:grayscale-0 transition-all"
          />
        </div>
      ))}
    </div>
  );
}