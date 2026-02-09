export const dynamic = 'force-dynamic';

import PhotoCarousel from './components/PhotoCarousel';
import PartnersCarousel from './components/PartnersCarousel';
import AwardsCarousel from './components/AwardsCarousel';
import CompanyProjects from './components/CompanyProjects';
import VideoCarousel from './components/VideoCarousel';

export default async function Home() {
  // Компоненты внутри себя сами вызывают нужные сервисы, 
  // поэтому здесь загрузка данных не требуется.

  return (
    <main className="bg-white min-h-screen">
      <div className="max-w-[1920px] mx-auto relative overflow-hidden">
        <PhotoCarousel />
        {/* Исправлено: удален несуществующий пропс projects */}
        <PartnersCarousel /> 
      </div>

      <AwardsCarousel />
      <VideoCarousel />
      <CompanyProjects />
    </main>
  );
}