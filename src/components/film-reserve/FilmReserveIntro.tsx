// src/components/film-reserve/FilmReserveIntro.tsx
import { FilmReserveSection } from '@/lib/services/filmReserve.service'

interface Props {
  section: FilmReserveSection | null
}

export default function FilmReserveIntro({ section }: Props) {
  if (!section) return null

  return (
    <section
      className="py-16 px-4"
      style={{ backgroundColor: section.bg_color ?? '#ffffff' }}
    >
      <div className="max-w-4xl mx-auto">
        {section.title && (
          <h1 className="text-3xl md:text-4xl font-bold text-black mb-6">
            {section.title}
          </h1>
        )}
        {section.body && (
          <div
            className="prose max-w-none text-black"
            dangerouslySetInnerHTML={{ __html: section.body }}
          />
        )}
      </div>
    </section>
  )
}