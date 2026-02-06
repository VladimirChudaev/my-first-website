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
      <div className="flex flex-col md:flex-row">
        {/* Текст (слева) */}
        <div className="md:w-1/2 p-8 flex flex-col justify-between">
          <div>
            <p className="text-base leading-relaxed mb-6">{description}</p>
            <hr className="border-t border-gray-300 my-6" />
            {!isTvProject && (
              <>
                <h3 className="text-2xl font-bold mb-3">{title}</h3>
                {author && <p className="text-lg text-gray-600">{author}</p>}
              </>
            )}
          </div>
        </div>

        {/* Изображение (справа) */}
        <div className="md:w-1/2 flex items-center justify-center bg-gray-50">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover min-h-[300px]"
            onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.png'; }}
          />
        </div>
      </div>
    </div>
  );
}