export const dynamic = 'force-dynamic';
export const revalidate = 0;

import PhotoCarousel from './components/PhotoCarousel';
import PartnersCarousel from './components/PartnersCarousel';
import AwardsCarousel from './components/AwardsCarousel';
import CompanyProjects from './components/CompanyProjects';
import VideoCarousel from './components/VideoCarousel';
import { createClient } from '@/lib/server';

export default async function Home() {
  const supabase = await createClient();

  // Загружаем все текстовые блоки для главной страницы
  const { data: content } = await supabase
    .from('page_content')
    .select('*')
    .eq('page', 'home')
    .eq('is_visible', true);

  // Функция-помощник для поиска нужного текста
  const getBlock = (key: string) => content?.find(b => b.section_key === key);

  return (
    <main className="bg-white min-h-screen">
      <PhotoCarousel />
      
      <div className="max-w-[1920px] mx-auto relative overflow-hidden">
        <PartnersCarousel /> 
      </div>

      {/* Передаем данные блоков в компоненты */}
      <AwardsCarousel content={getBlock('awards_intro')} />
      <VideoCarousel />
      <CompanyProjects content={getBlock('about_company')} />
    </main>
  );
}