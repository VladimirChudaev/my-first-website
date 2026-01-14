'use client';

import Image from 'next/image';

interface InnerPageHeaderProps {
  backgroundUrl: string;
  alt?: string;
}

export default function InnerPageHeader({
  backgroundUrl,
  alt = 'Header Background',
}: InnerPageHeaderProps) {
  return (
    <div className="relative w-full h-[200px]">
      <Image
        src={backgroundUrl}
        alt={alt}
        fill
        priority
        className="object-cover"
      />
    </div>
  );
}
