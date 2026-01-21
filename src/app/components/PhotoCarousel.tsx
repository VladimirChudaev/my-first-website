'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { mediaService } from '@/lib/services/MediaService';

interface PhotoCarouselProps {
  category?: string; // Optional category, defaults to 'photo'
}

export default function PhotoCarousel({ category = 'photo' }: PhotoCarouselProps) {
  const [photos, setPhotos] = useState<any[]>([]);
  const [imageUrls, setImageUrls] = useState<Record<string, string | null>>({});
  const [currentFilename, setCurrentFilename] = useState<string | null>(null);
  const [filenames, setFilenames] = useState<string[]>([]);

  useEffect(() => {
    const loadMedia = async () => {
      try {
        const mediaList = await mediaService.getByDomain(category as any);
        setPhotos(mediaList);
        
        // Создаем массив имен файлов
        const filenamesArray = mediaList.map((item: any) => item.filename);
        
        // Загружаем URL для каждого изображения
        const urls: Record<string, string | null> = {};
        for (const photo of mediaList) {
          if (photo.path) {
            urls[photo.filename] = await mediaService.getUrlByFilename(category as any, photo.filename);
          }
        }
        setImageUrls(urls);
        
        if (filenamesArray.length > 0) {
          setFilenames(filenamesArray);
          setCurrentFilename(filenamesArray[0]); // Start with first image
        }
      } catch (error) {
        console.error('Error loading media for PhotoCarousel:', error);
      }
    };

    loadMedia();
  }, [category]);

  useEffect(() => {
    if (filenames.length < 2 || !currentFilename) return;

    const currentIndex = filenames.indexOf(currentFilename);
    const timer = setInterval(() => {
      const nextIndex = (currentIndex + 1) % filenames.length;
      setCurrentFilename(filenames[nextIndex]);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(timer);
  }, [currentFilename, filenames]);

  if (filenames.length === 0 || !currentFilename) {
    return <div className="relative w-full aspect-video bg-gray-200">Loading...</div>;
  }

  return (
    <div className="relative w-full aspect-video bg-white">
      {filenames.map((filename, index) => {
        const imageUrl = imageUrls[filename];
        const isVisible = filename === currentFilename;
        
        return (
          <div
            key={filename}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {imageUrl && (
              <Image
                src={imageUrl}
                alt="Carousel Image"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
                priority={index === 0}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

