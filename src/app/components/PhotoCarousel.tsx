'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
// import { getMediaUrl } from '@/lib/supabase/getMediaUrl';

interface PhotoCarouselProps {
  images: string[]; // ['izh_1920x1080.jpg', 'chumazaya.jpg']
  intervals: number[];
}

export default function PhotoCarousel({ images, intervals }: PhotoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, intervals[currentIndex]);

    return () => clearInterval(timer);
  }, [currentIndex, images.length, intervals]);

  return (
    <div className="relative w-full aspect-video bg-white">
      {images.map((filename, index) => (
        <div
          key={filename}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
  src={`/photo/${filename}`}
  alt="Carousel Image"
  fill
  className="object-cover"
  priority={index === 0}
/>
        </div>
      ))}
    </div>
  );
}
