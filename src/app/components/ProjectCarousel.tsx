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
    <div className="relative w-full bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm mx-auto">
      <ProjectCard 
        {...projects[currentIndex]} 
        isTvProject={isTvCarousel} 
      />
    </div>
  );
}