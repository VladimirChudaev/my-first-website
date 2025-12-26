'use client';

import Image from 'next/image';

export default function InnerPageHeader() {
  return (
    <div
      className="relative w-full h-[200px]"
    >
      <Image
        src="/photo/header_bg.png"
        alt="Header Background"
        fill
        priority
        className="object-cover"
      />
    </div>
  );
}