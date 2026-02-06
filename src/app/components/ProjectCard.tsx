'use client';

interface ProjectCardProps {
  title: string;
  author: string;
  image: string;
  description: string;
  isTvProject?: boolean;
}

export default function ProjectCard({ 
  title, 
  author, 
  image, 
  description, 
  isTvProject = false 
}: ProjectCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full">
      <div className="flex flex-col md:flex-row h-full">
        {/* Текстовый блок (слева) */}
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
          <div>
            <p className="text-base leading-relaxed text-gray-700 mb-6">
              {description}
            </p>
            <hr className="border-t border-gray-200 my-6" />
            
            {!isTvProject && (
              <div className="mt-auto">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {title}
                </h3>
                {author && (
                  <p className="text-lg text-gray-500 italic">
                    {author}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Блок изображения (справа) */}
        <div className="md:w-1/2 bg-gray-100 relative min-h-[250px] md:min-h-[400px]">
          <img
            src={image}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
            // Обработка ошибки: если Supabase вернет 400 или 404, покажем заглушку
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (target.src !== '/placeholder.png') {
                target.src = '/placeholder.png';
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}

export type { ProjectCardProps };