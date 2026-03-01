export const dynamic = 'force-dynamic';
export const revalidate = 0;

// 1. Импортируем клиент базы данных
import { createClient } from '@/lib/server';

// 2. Импортируем все компоненты
import PhotoCarousel from './components/PhotoCarousel';
import PartnersCarousel from './components/PartnersCarousel';
import AwardsCarousel from './components/AwardsCarousel';
import CompanyProjects from './components/CompanyProjects';
import VideoCarousel from './components/VideoCarousel';
import NewsSection from './components/NewsSection';

export default async function Home() {
  const supabase = await createClient();

  // Загружаем все текстовые блоки для главной страницы
  const { data: content } = await supabase
    .from('page_content')
    .select('*')
    .eq('page', 'home');

  // Функция-помощник (добавили типизацию : any, чтобы ушла ошибка "b")
  const getBlock = (key: string) => content?.find((b: any) => b.section_key === key);

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
      
      {/* Секция новостей, которой мы занимались */}
      <NewsSection content={getBlock('news_intro')} />
    </main>
  );
}