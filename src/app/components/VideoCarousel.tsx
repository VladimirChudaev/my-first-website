'use client';

import { useEffect, useState, useRef } from 'react';
import { getMediaByDomain, getMediaUrl } from '@/lib/media/media';
import { MediaAsset } from '@/lib/media/types';

interface VideoAsset extends MediaAsset {
  previewUrl?: string;
}

export default function VideoCarousel() {
  const [videos, setVideos] = useState<VideoAsset[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getMediaByDomain('video');
        const filtered = data.filter(v => v.path);
        const mapped: VideoAsset[] = await Promise.all(
          filtered.map(async (video) => ({
            ...video,
            previewUrl: await getMediaUrl(video.path!),
          }))
        );
        setVideos(mapped);
      } catch (error) {
        console.error('Video load error:', error);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (videos.length <= 3) return;
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % videos.length);
    }, 5000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [videos.length]);

  if (!videos.length) return null;

  const visibleSlides = [];
  for (let i = 0; i < 3; i++) {
    visibleSlides.push(videos[(currentIndex + i) % videos.length]);
  }

  return (
    // Уменьшил вертикальные отступы py-8 вместо py-20, чтобы не было дыр
    <section className="bg-white py-8">
      {/* max-w-[1440px] или full сделает карточки максимально крупными, как на скрине main */}
      <div className="container mx-auto max-w-[1400px] px-4">
        
        {/* Сетка с фиксированным gap, чтобы размер карточек был стабильным */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {visibleSlides.map((video, idx) => (
            <div 
              key={`${video.id}-${idx}`} 
              className="relative aspect-video bg-gray-100 overflow-hidden shadow-sm"
            >
              <a 
                href={video.url || '#'} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="block w-full h-full"
              >
                {video.previewUrl && (
                  <img
                    src={video.previewUrl}
                    alt={video.alt_text || ''}
                    className="w-full h-full object-cover"
                  />
                )}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}