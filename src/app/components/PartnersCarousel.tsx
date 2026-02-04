import { getPartners } from '@/lib/queries/partners';

export default async function PartnersCarousel() {
  const partners = await getPartners();

  return (
    <div className="flex gap-6 overflow-x-auto">
      {partners.map((p) => {
        const media = p.media?.[0];
        if (!media) return null;

        return (
          <a
            key={p.id}
            href={p.url ?? undefined}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center opacity-90 hover:opacity-100 transition-opacity"
          >
            <img
              src={media.url}
              alt={media.alt_text ?? p.name}
              className="h-20 object-contain"
              loading="lazy"
            />
          </a>
        );
      })}
    </div>
  );
}
