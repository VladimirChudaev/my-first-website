import { getPartners } from '@/lib/queries/partners'

export default async function PartnersCarousel() {
  const partners = await getPartners()

  if (!partners?.length) return null

  return (
    <div className="flex gap-6 overflow-x-auto">
      {partners.map((p) => {
        const media = p.media?.[0]   // ← ВОТ ОН

        if (!media) return null

        return (
          <a
            key={p.id}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={media.url}
              alt={media.alt_text ?? p.name}
              className="h-20 object-contain"
            />
          </a>
        )
      })}
    </div>
  )
}
