// src/components/film-reserve/FilmReserveContact.tsx
import { FilmReserveSection } from '@/lib/services/filmReserve.service'

interface Props {
  section: FilmReserveSection | null
}

export default function FilmReserveContact({ section }: Props) {
  if (!section) return null

  return (
    <section
      className="py-16 px-4"
      style={{ backgroundColor: section.bg_color ?? '#ffffff' }}
    >
      <div className="max-w-4xl mx-auto">
        {section.title && (
          <h2 className="text-2xl md:text-3xl font-semibold text-black mb-6">
            {section.title}
          </h2>
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