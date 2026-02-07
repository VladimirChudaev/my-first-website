'use client';

import { useState, useEffect } from 'react';
import ProjectCard from './ProjectCard';

interface ProjectCarouselProps {
  projects: any[];
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

  if (!projects || projects.length === 0) return null;

  return (
    <div className="w-full">
      <div className="transition-all duration-500 ease-in-out">
        <ProjectCard 
          key={projects[currentIndex].id}
          title={projects[currentIndex].title}
          description={projects[currentIndex].description}
          author={projects[currentIndex].author}
          imageUrl={projects[currentIndex].imageUrl}
          isTvProject={isTvCarousel} 
        />
      </div>
      
      {projects.length > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {projects.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 transition-all duration-300 rounded-full ${
                idx === currentIndex ? 'w-8 bg-gray-800' : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}