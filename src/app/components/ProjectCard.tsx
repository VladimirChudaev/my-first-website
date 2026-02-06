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
    <div className="bg-white rounded-lg overflow-hidden h-full">
      <div className="flex flex-col md:flex-row min-h-[450px]">
        {/* Текст (слева) */}
        <div className="md:w-1/2 p-6 md:p-10 flex flex-col justify-between">
          <div>
            <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-6">
              {description}
            </p>
            <hr className="border-t border-gray-200 my-6" />
            
            {!isTvProject && (
              <div className="mt-auto">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
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

        {/* Изображение (справа) */}
        <div className="md:w-1/2 relative bg-gray-50 min-h-[300px]">
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