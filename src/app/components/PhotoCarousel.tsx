'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getMediaByDomain, getMediaUrl } from '@/lib/media/media';
import { MediaAsset } from '@/lib/media/types';

interface PhotoCarouselProps {
  category?: string;
}

export default function PhotoCarousel({ category = 'photo' }: PhotoCarouselProps) {
  const [photos, setPhotos] = useState<MediaAsset[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const loadMedia = async () => {
      try {
        const mediaList = await getMediaByDomain(category as any);
        const filtered = mediaList.filter(
          (item: MediaAsset) => item.filename?.startsWith('pc_') && item.path
        );

        const mapped = await Promise.all(
          filtered.map(async (item) => ({
            ...item,
            url: await getMediaUrl(item.path!),
          }))
        );

        setPhotos(mapped);
      } catch (error) {
        console.error('Error loading media for PhotoCarousel:', error);
      }
    };
    loadMedia();
  }, [category]);

  useEffect(() => {
    if (photos.length < 2) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % photos.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [photos]);

  // Заменил bg-gray-200 на bg-transparent
  if (!photos.length) {
    return <div className="relative w-full aspect-video bg-transparent" />;
  }

  return (
    // Заменил bg-white на bg-transparent
    <div className="relative w-full aspect-video bg-transparent">
      {photos.map((photo, index) => {
        const isVisible = index === currentIndex;

        return (
          <div
            key={photo.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {photo.url && (
              <Image
                src={photo.url}
                alt={photo.alt_text || 'Carousel Image'}
                fill
                sizes="100vw"
                className="object-cover"
                priority={index === 0}
                unoptimized={photo.url.endsWith('.svg')}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}