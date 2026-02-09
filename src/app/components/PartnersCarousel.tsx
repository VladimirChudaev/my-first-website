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
        setPartners(data);
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
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">
          Наши партнеры
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center justify-items-center">
          {partners.map((partner) => (
            <div 
              key={partner.id} 
              className="relative w-full h-20 grayscale hover:grayscale-0 transition-all duration-300"
            >
              {partner.imageUrl && (
                <Image
                  src={partner.imageUrl}
                  alt={partner.name || 'Partner'}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 50vw, 15vw"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}