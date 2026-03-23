'use client';

import { useEffect, useState, useRef } from 'react';
import { Play } from 'lucide-react';
import { getVideoProjects } from '@/lib/video-projects/video-projects.supabase';
import { getMediaUrl } from '@/lib/media/media';

export default function VideoCarousel() {
  const [videos, setVideos] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        // Шаг 1: Получаем список проектов через наш новый сервис
        const data = await getVideoProjects();
        
        // Шаг 2: Формируем полные URL для обложек
        const mapped = await Promise.all(
          data.map(async (item) => ({
            id: item.id,
            videoUrl: item.url,
            // Используем стандартный хелпер проекта для получения публичной ссылки
            previewUrl: item.media?.path ? await getMediaUrl(item.media.path) : null,
            alt: item.media?.alt_text || item.title || ''
          }))
        );
        
        setVideos(mapped);
      } catch (err) {
        console.error('Ошибка при загрузке видео-карусели:', err);
      }
    };
    load();
  }, []);

  // Логика автоматической прокрутки (если видео больше 3)
  useEffect(() => {
    if (videos.length <= 3) return;
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % videos.length);
    }, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [videos.length]);

  if (!videos.length) return null;

  // Вычисляем, какие 3 слайда показать сейчас
  const visibleSlides = [];
  for (let i = 0; i < 3; i++) {
    const slide = videos[(currentIndex + i) % videos.length];
    if (slide) visibleSlides.push(slide);
  }

  return (
    <section className="bg-white py-8">
      <div className="container mx-auto max-w-[1400px] px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {visibleSlides.map((video, idx) => (
            <div 
              key={`${video.id}-${idx}`} 
              className="relative aspect-video bg-gray-100 overflow-hidden shadow-sm group border border-gray-100 rounded-sm"
            >
              <a 
                href={video.videoUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="block w-full h-full relative"
              >
                {/* Изображение-заглушка (обложка) */}
                {video.previewUrl && (
                  <img
                    src={video.previewUrl}
                    alt={video.alt}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}

                {/* Слой с "стеклянной" кнопкой Play */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/5 group-hover:bg-black/20 transition-all duration-500">
                  <div className="w-20 h-20 flex items-center justify-center rounded-full bg-white/10 border border-white/20 backdrop-blur-[2px] shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:bg-white/20">
                    <Play 
                      size={40} 
                      fill="white" 
                      className="ml-1 text-white opacity-40 transition-opacity duration-300 group-hover:opacity-90" 
                    />
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}