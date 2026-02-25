// src/components/film-reserve/FilmReserveGallery.tsx
import Image from 'next/image'
import { FilmReservePhoto } from '@/lib/services/filmReserve.service'

interface Props {
  photos: FilmReservePhoto[]
}

export default function FilmReserveGallery({ photos }: Props) {
  if (!photos || photos.length === 0) return null

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {photos.map((photo) => {
          if (!photo.url) return null

          return (
            <div key={photo.id} className="relative w-full">
              <Image
                src={photo.url}
                alt={photo.alt_text || ''}
                width={photo.width || 1200}
                height={photo.height || 800}
                className="w-full h-auto object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={false}
              />
            </div>
          )
        })}
      </div>
    </section>
  )
}