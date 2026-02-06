'use client';

export interface ProjectCardProps {
  title: string;
  author: string;
  image: string;
  description: string;
  isTvProject?: boolean;
}

export default function ProjectCard({ title, author, image, description, isTvProject = false }: ProjectCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm w-full">
      <div className="flex flex-col md:flex-row min-h-fit">
        {/* Блок текста */}
        <div className="md:w-1/2 p-8 flex flex-col justify-center bg-white">
          <p className="text-base leading-relaxed text-gray-700 mb-6">
            {description}
          </p>
          <hr className="border-t border-gray-300 my-6" />
          {!isTvProject && (
            <div className="mt-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
              {author && <p className="text-lg text-gray-500 italic">{author}</p>}
            </div>
          )}
        </div>

        {/* Блок изображения */}
        <div className="md:w-1/2 flex">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover min-h-[300px]"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.png';
            }}
          />
        </div>
      </div>
    </div>
  );
}