export const dynamic = 'force-dynamic';

import InnerPageHeader from '@/components/InnerPageHeader';
import { getPartners } from '@/lib/queries/partners';

export default async function PartnersPage() {
  const partners = await getPartners();

  return (
    <>
      <InnerPageHeader />

      <main className="min-h-screen bg-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Наши партнеры
          </h1>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-6 max-w-7xl mx-auto">
            {partners.map((p) => {
              const media = p.media?.[0];
              if (!media) return null;

              const Wrapper: any = p.url ? 'a' : 'div';

              return (
                <Wrapper
                  key={p.id}
                  {...(p.url
                    ? {
                        href: p.url,
                        target: '_blank',
                        rel: 'noopener noreferrer',
                      }
                    : {})}
                  className="flex items-center justify-center p-4 opacity-90 hover:opacity-100 transition-opacity"
                  aria-label={p.name}
                >
                  <img
                    src={media.url}
                    alt={media.alt_text ?? p.name}
                    className="max-h-16 w-auto object-contain"
                    loading="lazy"
                  />
                </Wrapper>
              );
            })}
          </div>
        </div>
      </main>
    </>
  );
}
