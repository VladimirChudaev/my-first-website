'use client'

import Image from 'next/image'

export interface InnerPageHeaderProps {
  backgroundUrl?: string
  title?: string
}

export default function InnerPageHeader({
  backgroundUrl,
  title,
}: InnerPageHeaderProps) {
  if (!backgroundUrl) {
    return (
      <section className="w-full h-[240px] bg-gray-200 flex items-center justify-center">
        {title && (
          <h1 className="text-2xl font-semibold text-gray-700">
            {title}
          </h1>
        )}
      </section>
    )
  }

  return (
    <section className="relative w-full h-[240px] overflow-hidden">
      <Image
        src={backgroundUrl}
        alt={title ?? 'Page header'}
        fill
        priority
        className="object-cover"
      />
      {title && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <h1 className="text-3xl font-bold text-white">
            {title}
          </h1>
        </div>
      )}
    </section>
  )
}
