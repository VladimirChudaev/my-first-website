'use client';

import { useEffect, useState } from 'react';
import { PartnersService, PartnerDTO } from '@/lib/services/PartnersService';
import InnerPageHeader from '@/app/components/InnerPageHeader';

export default function PartnersPage() {
  const [partners, setPartners] = useState<PartnerDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
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

  return (
    <>
      {/* Теперь просто плашка без текста внутри */}
      <InnerPageHeader />

      <main className="min-h-screen bg-white">
        <div className="container mx-auto px-6 py-10 md:py-16 max-w-6xl">
          
          {/* Заголовок теперь здесь — точно как в news/page.tsx */}
          <h1 className="text-2xl md:text-3xl font-bold text-black text-center mb-12 uppercase tracking-[0.3em]">
            Наши партнеры
          </h1>

          {loading ? (
            <div className="text-center py-10 text-gray-400">Загрузка...</div>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center justify-items-center">
              {partners.map((partner) => (
                <div key={partner.id} className="w-full flex items-center justify-center">
                  {partner.url ? (
                    <a href={partner.url} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                      <img
                        src={partner.imageUrl || '/placeholder.png'}
                        alt={partner.name}
                        className="max-w-full max-h-12 md:max-h-16 object-contain"
                      />
                    </a>
                  ) : (
                    <img
                      src={partner.imageUrl || '/placeholder.png'}
                      alt={partner.name}
                      className="max-w-full max-h-12 md:max-h-16 object-contain"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}