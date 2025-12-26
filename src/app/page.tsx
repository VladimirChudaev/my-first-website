import SiteHeader from './components/SiteHeader';
import PhotoCarousel from './components/PhotoCarousel';
import PartnersCarousel from './components/PartnersCarousel';
import AwardsCarousel from './components/AwardsCarousel';
import VideoCarousel from './components/VideoCarousel';
import CompanyProjects from './components/CompanyProjects';
export default function Home() {
  const images = ["/photo/ИЖ_1920на1080.jpg", "/photo/Чумазая.jpg"]; 
  const intervals = [5000, 5000];

  return (
    <main className="bg-white min-h-screen">
      {/* Обертка для верхней части: шапка, главное фото и партнеры */}
      <div className="max-w-[1920px] mx-auto relative overflow-hidden">
        <SiteHeader />
        <PhotoCarousel images={images} intervals={intervals} />
        <PartnersCarousel />
      </div>

      {/* Блок наград */}
      <AwardsCarousel />

      {/* Блок видео-ленты RuTube */}
      <VideoCarousel />

      {/* Секция проектов с текстовым блоком и цветными карточками */}
      <CompanyProjects />

      {/* Подвал сайта */}
    </main>
  );
}