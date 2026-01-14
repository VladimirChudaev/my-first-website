'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { createMediaService, MediaAsset } from '@/lib/media.mock';

export default function VideoCarousel() {
  const [videos, setVideos] = useState<MediaAsset[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const load = async () => {
      const media = createMediaService();
      const data = await media.getVideos();
      setVideos(data);
    };
    load();
  }, []);

  useEffect(() => {
    if (videos.length < 2) return;

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % videos.length);
    }, 5000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [videos.length]);

  if (videos.length === 0) return null;

  const getVisibleSlides = () => {
    const total = videos.length;
    if (total <= 3) return videos;

    const prev = (currentIndex - 1 + total) % total;
    const next = (currentIndex + 1) % total;
    return [videos[prev], videos[currentIndex], videos[next]];
  };

  const visibleSlides = getVisibleSlides();

  return (
    <section className="bg-white py-20 overflow-hidden">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="flex justify-center gap-8">
          {visibleSlides.map((video) => (
            <div
              key={video.id}
              className="w-1/3 aspect-video rounded-xl overflow-hidden shadow-lg"
            >
              <a
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="relative block w-full h-full"
              >
                <Image
                  src={video.path}
                  alt={video.alt || ''}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/40 transition">
                  <span className="text-white text-2xl">▶</span>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
