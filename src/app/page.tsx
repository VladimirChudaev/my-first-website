export const dynamic = 'force-dynamic';

import { PartnersService } from '@/lib/services/PartnersService';
import { ProjectsService } from '@/lib/services/ProjectsService';

import PhotoCarousel from './components/PhotoCarousel';
import PartnersCarousel from './components/PartnersCarousel';
import AwardsCarousel from './components/AwardsCarousel';
import CompanyProjects from './components/CompanyProjects';
import VideoCarousel from './components/VideoCarousel';

export default async function Home() {
  // Данные загружаем (чтобы сервисы были проверены билдом), 
  // но в компоненты пока не передаем, так как они их не ждут.
  const partners = await PartnersService.getAll();
  const projects = await ProjectsService.getProjectsWithMedia();

  return (
    <main className="bg-white min-h-screen">
      <div className="max-w-[1920px] mx-auto relative overflow-hidden">
        {/* Убрали пропсы, чтобы соответствовать пустым типам {} внутри компонентов */}
        <PhotoCarousel />
        <PartnersCarousel projects={projects} /> 
      </div>

      <AwardsCarousel />
      <VideoCarousel />
      <CompanyProjects />
    </main>
  );
}