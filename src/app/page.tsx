export const dynamic = 'force-dynamic';

import nextDynamic from 'next/dynamic';
import { PartnersService } from '@/lib/services/PartnersService';
import { ProjectsService } from '@/lib/services/ProjectsService';

import PhotoCarousel from './components/PhotoCarousel';
import PartnersCarousel from './components/PartnersCarousel';
import AwardsCarousel from './components/AwardsCarousel';
import CompanyProjects from './components/CompanyProjects';

const VideoCarousel = nextDynamic(
  () => import('./components/VideoCarousel'),
  { ssr: false }
);

export default async function Home() {
  const partners = await PartnersService.getAll();
  const projects = await ProjectsService.getProjectsWithMedia();

  return (
    <main className="bg-white min-h-screen">
      <div className="max-w-[1920px] mx-auto relative overflow-hidden">
        <PhotoCarousel />
        
        {/* Передаем projects, потому что PartnersCarousel их требует (согласно твоей ошибке) */}
        <PartnersCarousel projects={projects} />
      </div>

      <AwardsCarousel />
      <VideoCarousel />
      <CompanyProjects />
    </main>
  );
}