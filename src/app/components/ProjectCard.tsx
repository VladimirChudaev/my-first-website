'use client';

export interface ProjectCardProps {
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
    <div className="w-full bg-white border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex flex-col md:flex-row w-full min-h-[400px]">
        
        {/* Левая часть: Текст (50%) */}
        <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-center">
          <div className="max-w-md mx-auto md:mx-0">
            <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-8">
              {description}
            </p>
            
            {!isTvProject && (
              <div className="space-y-1">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                  {title}
                </h3>
                {author && (
                  <p className="text-gray-500 text-sm md:text-md italic">
                    {author}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Правая часть: Изображение (50%) */}
        <div className="w-full md:w-1/2 relative bg-gray-50 h-[300px] md:h-auto">
          <img
            src={image}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (target.src !== '/placeholder.png') target.src = '/placeholder.png';
            }}
          />
        </div>
      </div>
    </div>
  );
}