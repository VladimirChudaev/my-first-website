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
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      <div className="flex flex-col md:flex-row w-full">
        {/* Текст (слева) */}
        <div className="md:w-1/2 p-8 flex flex-col justify-center">
          <div>
            {/* Убрали line-clamp, теперь текст будет виден ВЕСЬ */}
            <p className="text-base leading-relaxed text-gray-700 mb-6">
              {description}
            </p>
            <hr className="border-t border-gray-300 my-6" />
            {!isTvProject && (
              <div className="mt-4">
                <h3 className="text-2xl font-bold mb-2">{title}</h3>
                {author && <p className="text-lg text-gray-500 italic">{author}</p>}
              </div>
            )}
          </div>
        </div>

        {/* Изображение (справа) */}
        <div className="md:w-1/2 relative bg-gray-50 min-h-[400px]">
          <img
            src={image}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.png';
            }}
          />
        </div>
      </div>
    </div>
  );
}