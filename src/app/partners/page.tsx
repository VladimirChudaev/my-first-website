'use client';

import { useEffect, useState } from 'react';
import { PartnersService, PartnerDTO } from '@/lib/services/PartnersService';

export default function PartnersPage() {
  const [partners, setPartners] = useState<PartnerDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        // ИСПРАВЛЕНО: метод называется getVisible()
        const data = await PartnersService.getVisible();
        setPartners(data);
      } catch (error) {
        console.error('Error fetching partners:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPartners();
  }, []);

  if (loading) return <div className="p-8 text-center">Загрузка...</div>;

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-12 text-center">Наши партнеры</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {partners.map((partner) => (
          <div key={partner.id} className="flex flex-col items-center group">
            <div className="w-full h-32 relative mb-4 p-4 border rounded-lg hover:shadow-lg transition-shadow bg-white">
              {/* ИСПРАВЛЕНО: проверяем partner.url вместо websiteUrl */}
              {partner.url ? (
                <a 
                  href={partner.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <img
                    // ИСПРАВЛЕНО: imageUrl вместо logoUrl
                    src={partner.imageUrl || '/placeholder.png'}
                    alt={partner.name}
                    className="object-contain w-full h-full filter grayscale group-hover:grayscale-0 transition-all"
                  />
                </a>
              ) : (
                <img
                  src={partner.imageUrl || '/placeholder.png'}
                  alt={partner.name}
                  className="object-contain w-full h-full filter grayscale"
                />
              )}
            </div>
            <h3 className="text-lg font-medium text-gray-800">{partner.name}</h3>
            {/* ИСПРАВЛЕНО: используем partner.url */}
            {partner.url && (
              <p className="text-sm text-blue-600 truncate max-w-full">
                {new URL(partner.url).hostname}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}