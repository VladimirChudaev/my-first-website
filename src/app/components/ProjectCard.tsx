'use client';

export interface ProjectCardProps {
  title: string;
  author?: string;
  imageUrl?: string;
  description: string;
  isTvProject?: boolean;
}

export default function ProjectCard({ 
  title, 
  author, 
  imageUrl, 
  description, 
  isTvProject = false 
}: ProjectCardProps) {
  
  return (
    <div className="w-full bg-white border border-gray-100 rounded-lg overflow-hidden shadow-md">
      <div className="flex flex-col md:flex-row min-h-[500px]">
        
        {/* ЛЕВАЯ ЧАСТЬ: КОНТЕНТ */}
        <div className="w-full md:w-1/2 p-10 md:p-16 flex flex-col justify-between bg-white order-2 md:order-1">
          <div>
            <div className="w-12 border-t-4 border-red-600 mb-8"></div>
            <p className="text-xl md:text-2xl leading-relaxed text-gray-700 italic font-light">
              «{description}»
            </p>
          </div>

          <div className="mt-12">
            <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter leading-none">
              {title}
            </h3>
            <p className="text-lg text-gray-400 font-medium mt-3 uppercase tracking-[0.2em]">
              {author}
            </p>
          </div>
        </div>

        {/* ПРАВАЯ ЧАСТЬ: ФОТО */}
        <div className="w-full md:w-1/2 relative min-h-[400px] bg-[#fdfdfd] flex items-center justify-center order-1 md:order-2 p-6">
          <img
            src={imageUrl || '/placeholder.png'}
            alt={title}
            className="max-w-full max-h-full object-contain shadow-sm"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.png';
            }}
          />
        </div>

      </div>
    </div>
  );
}