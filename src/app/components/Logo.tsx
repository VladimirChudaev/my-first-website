'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { mediaService } from '@/lib/services/MediaService';

interface LogoProps {
  className?: string;
}

export default function Logo({ className }: LogoProps) {
  const [logoUrl, setLogoUrl] = useState<string>('/photo/logo.png'); // fallback на старый путь
  const [altText, setAltText] = useState<string>('Logo');

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const logoAssets = await mediaService.getByDomain('logo');
        if (logoAssets.length > 0) {
          const logo = logoAssets[0];
          const url = await mediaService.getUrlByFilename('logo', logo.filename);
          if (url) {
            setLogoUrl(url);
            setAltText(logo.alt_text || 'Logo');
          }
        }
      } catch (error) {
        console.error('Error fetching logo:', error);
        // Оставляем fallback значение
      }
    };

    fetchLogo();
  }, []);

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