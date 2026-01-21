'use client';

import dynamic from 'next/dynamic';

import SiteHeader from './components/SiteHeader';
import PhotoCarousel from './components/PhotoCarousel';
import PartnersCarousel from './components/PartnersCarousel';
import AwardsCarousel from './components/AwardsCarousel';
import CompanyProjects from './components/CompanyProjects';

// VideoCarousel — client-only
const VideoCarousel = dynamic(
  () => import('./components/VideoCarousel'),
  { ssr: false }
);

export default function Home() {
  return (
    <main className="bg-white min-h-screen">
      <div className="max-w-[1920px] mx-auto relative overflow-hidden">
        <SiteHeader />
        <PhotoCarousel />
        <PartnersCarousel />
      </div>

      <AwardsCarousel />
      <VideoCarousel />
      <CompanyProjects />
    </main>
  );
}
