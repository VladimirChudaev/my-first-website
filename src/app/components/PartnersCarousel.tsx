'use client';

import Image from 'next/image';

interface Partner {
  id: string | number;
  imageUrl: string;
  name?: string;
}

interface PartnersCarouselProps {
  // Делаем пропс необязательным (?), чтобы не было ошибок в page.tsx
  partners?: Partner[];
}

export default function PartnersCarousel({ partners = [] }: PartnersCarouselProps) {
  // Если партнеров нет, компонент просто не отображается, не ломая сайт
  if (!partners || partners.length === 0) return null;

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">Наши партнеры</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center justify-items-center">
          {partners.map((partner) => (
            <div key={partner.id} className="relative w-full h-20 grayscale hover:grayscale-0 transition-all duration-300">
              <Image
                src={partner.imageUrl}
                alt={partner.name || 'Partner'}
                fill
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}