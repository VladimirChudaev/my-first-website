// Директивы для отключения кэширования всей страницы
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import PhotoCarousel from './components/PhotoCarousel';
import PartnersCarousel from './components/PartnersCarousel';
import AwardsCarousel from './components/AwardsCarousel';
import CompanyProjects from './components/CompanyProjects';
import VideoCarousel from './components/VideoCarousel';

/**
 * Главная страница сайта.
 * Благодаря директивам dynamic и revalidate, сервер будет заново 
 * запрашивать данные из Supabase при каждом посещении пользователем.
 */
export default async function Home() {
  return (
    <main className="bg-white min-h-screen">
      {/* PhotoCarousel находится вне контейнера для корректного отображения под хедером */}
      <PhotoCarousel />
      
      <div className="max-w-[1920px] mx-auto relative overflow-hidden">
        <PartnersCarousel /> 
      </div>

      <AwardsCarousel />
      <VideoCarousel />
      <CompanyProjects />
    </main>
  );
}