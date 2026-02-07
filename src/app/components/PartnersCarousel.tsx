'use client';

import ProjectCard from './ProjectCard';

interface Project {
  id: string;
  title: string;
  description: string;
  author?: string;
  imageUrl?: string;
}

interface ProjectCarouselProps {
  projects: Project[];
  isTvCarousel?: boolean;
}

export default function ProjectCarousel({ projects, isTvCarousel = false }: ProjectCarouselProps) {
  if (!projects || projects.length === 0) return null;

  return (
    <div className="flex flex-col gap-12">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          title={project.title}
          description={project.description}
          author={project.author}
          imageUrl={project.imageUrl}
          isTvProject={isTvCarousel}
        />
      ))}
    </div>
  );
}