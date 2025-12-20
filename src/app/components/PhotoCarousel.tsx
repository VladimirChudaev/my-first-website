'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface PhotoCarouselProps {
  images: string[];
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
      {images.map((image, index) => (
        <div
          key={image}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={image}
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