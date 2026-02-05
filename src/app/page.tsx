'use client';

export const dynamic = 'force-dynamic';

import nextDynamic from 'next/dynamic';

import PhotoCarousel from './components/PhotoCarousel';
import PartnersCarousel from './components/PartnersCarousel';
import AwardsCarousel from './components/AwardsCarousel';
import CompanyProjects from './components/CompanyProjects';

const VideoCarousel = nextDynamic(
  () => import('./components/VideoCarousel'),
  { ssr: false }
);

export default function Home() {
  return (
    <main className="bg-white min-h-screen">
      <div className="max-w-[1920px] mx-auto relative overflow-hidden">
        <PhotoCarousel />
        <PartnersCarousel />
      </div>

      <AwardsCarousel />
      <VideoCarousel />
      <CompanyProjects />
    </main>
  );
}
