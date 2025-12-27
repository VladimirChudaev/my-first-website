import Image from 'next/image';

interface ProjectCardProps {
  title: string;
  author: string;
  image: string;
  description: string;
  isTvProject?: boolean; // Добавляем опциональный пропс
}

export default function ProjectCard({ title, author, image, description, isTvProject = false }: ProjectCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row">
        {/* Текст (слева) */}
        <div className="md:w-1/2 p-8 flex flex-col justify-between">
          <div>
            <p className="text-base leading-relaxed mb-6">{description}</p>
            <hr className="border-t border-gray-300 my-6" />
            {/* Для телевизионных проектов оставляем поля пустыми */}
            {!isTvProject && (
              <>
                <h3 className="text-2xl font-bold mb-3">{title}</h3>
                {author && <p className="text-lg text-gray-600">{author}</p>}
              </>
            )}
          </div>
        </div>

        {/* Изображение (справа) */}
        <div className="md:w-1/2 flex items-center justify-center">
          <Image
            src={image}
            alt={title}
            width={400}
            height={300}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}

export type { ProjectCardProps };