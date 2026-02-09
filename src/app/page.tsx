// src/app/page.tsx
import PhotoCarousel from './components/PhotoCarousel';
import PartnersCarousel from './components/PartnersCarousel';
import AwardsCarousel from './components/AwardsCarousel';
import CompanyProjects from './components/CompanyProjects';
import VideoCarousel from './components/VideoCarousel';

export default async function Home() {
  return (
    // Убираем все лишние отступы у main
    <main className="bg-white min-h-screen">
      {/* ВАЖНО: PhotoCarousel должна быть ПЕРВЫМ элементом без оберток, 
        чтобы она ушла под абсолютный хедер.
      */}
      <PhotoCarousel />
      
      {/* Остальной контент уже может быть в ограничителе */}
      <div className="max-w-[1920px] mx-auto relative overflow-hidden">
        <PartnersCarousel /> 
      </div>

      <AwardsCarousel />
      <VideoCarousel />
      <CompanyProjects />
    </main>
  );
}