import InnerPageHeader from '@/components/InnerPageHeader';
import { partnersData } from '@/data/partners'; // Импортируем данные из общего файла

export default function PartnersPage() {
  return (
    <>
      <InnerPageHeader />
      <main className="min-h-screen bg-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Наши партнеры
          </h1>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-6 max-w-7xl mx-auto">
            {partnersData.map((partner, index) => ( // Используем импортированный массив
              <a
                key={index}
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center p-4 opacity-90 hover:opacity-100 transition-opacity"
                aria-label={partner.name}
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="max-h-16 w-auto object-contain"
                  loading="lazy"
                />
              </a>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}