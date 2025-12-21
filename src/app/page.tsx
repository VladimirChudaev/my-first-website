import SiteHeader from './components/SiteHeader';
import PhotoCarousel from './components/PhotoCarousel';
import PartnersCarousel from './components/PartnersCarousel';
import AwardsCarousel from './components/AwardsCarousel';
import VideoCarousel from './components/VideoCarousel'; // 1. Добавили импорт видео-карусели

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

      {/* 2. Добавили блок видео-ленты RuTube сразу под наградами */}
      <VideoCarousel />

      {/* Секция проектов */}
      <section className="h-[150vh] bg-white w-full px-10 py-20">
        <div className="container mx-auto">
          <h2 className="text-black text-4xl font-light border-b border-gray-100 pb-10">
            ПРОЕКТЫ КИНОКОМПАНИИ
          </h2>
        </div>
      </section>
    </main>
  );
}