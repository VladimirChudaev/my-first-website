'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

type CarouselItem = {
  id: string;
  is_visible: boolean;
  position: number;
  media: {
    filename: string;
  } | null;
};

export default function PhotoCarousel() {
  const [items, setItems] = useState<CarouselItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const storageUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  useEffect(() => {
    const loadItems = async () => {
      try {
        // Запрашиваем данные напрямую из API карусели
        const res = await fetch('/api/admin/home-carousel');
        const json = await res.json();
        
        // Оставляем только те, что помечены как "Опубликован" и имеют картинку
        const activeItems = (json.data || []).filter(
          (item: CarouselItem) => item.is_visible && item.media?.filename
        );
        
        setItems(activeItems);
      } catch (error) {
        console.error('Error loading PhotoCarousel items:', error);
      }
    };
    loadItems();
  }, []);

  useEffect(() => {
    if (items.length < 2) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [items]);

  if (!items.length) {
    return <div className="relative w-full aspect-video bg-transparent" />;
  }

  return (
    <div className="relative w-full aspect-video bg-transparent overflow-hidden">
      {items.map((item, index) => {
        const isVisible = index === currentIndex;
        // Формируем прямой URL к картинке в Supabase
        const imageUrl = `${storageUrl}/storage/v1/object/public/media/${item.media?.filename}`;

        return (
          <div
            key={item.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={imageUrl}
              alt={`Slide ${index + 1}`}
              fill
              sizes="100vw"
              className="object-cover"
              priority={index === 0}
            />
          </div>
        );
      })}
    </div>
  );
}