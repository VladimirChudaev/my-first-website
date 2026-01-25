'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { getMediaByDomain, getMediaUrl } from '@/lib/media/media';

interface LogoProps {
  className?: string;
}

export default function Logo({ className }: LogoProps) {
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [altText, setAltText] = useState<string>('Logo');

  useEffect(() => {
    const loadLogo = async () => {
      try {
        const assets = await getMediaByDomain('photo');
        const logo = assets.find(a =>
          a.filename?.toLowerCase().startsWith('logo')
        );

        if (!logo?.path) return;

        const url = await getMediaUrl(logo.path);
        setLogoUrl(url);
        setAltText(logo.alt_text || 'Logo');
      } catch (e) {
        console.error('Logo load error:', e);
      }
    };

    loadLogo();
  }, []);

  if (!logoUrl) return null;

  return (
    <div className={`relative ${className}`} style={{ width: '100%', height: '100%' }}>
      <Image
        src={logoUrl}
        alt={altText}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-contain"
        priority
      />
    </div>
  );
}
