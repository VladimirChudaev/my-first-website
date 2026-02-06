'use client';

import { useState, useEffect } from 'react';
import ProjectCard, { type ProjectCardProps } from './ProjectCard';

interface ProjectCarouselProps {
  projects: ProjectCardProps[];
  isTvCarousel?: boolean;
}

export default function ProjectCarousel({ projects, isTvCarousel = false }: ProjectCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (projects.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % projects.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [projects.length]);

  if (projects.length === 0) return null;

  return (
    <div className="w-full">
      <div className="transition-opacity duration-500">
        <ProjectCard 
          {...projects[currentIndex]} 
          isTvProject={isTvCarousel} 
        />
      </div>
      
      {/* Индикаторы (опционально, для удобства) */}
      {projects.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {projects.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2 h-2 rounded-full transition-colors ${
                idx === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}