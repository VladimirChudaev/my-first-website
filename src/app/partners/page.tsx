import InnerPageHeader from '@/components/InnerPageHeader';
import { getMediaByDomain, getMediaUrl } from '@/lib/media/media';
import { MediaAsset } from '@/lib/media/types';

interface Partner {
  name: string;
  url?: string;
  logo: string;
}

export default async function PartnersPage() {
  const assets = await getMediaByDomain('partner');

  const partners: Partner[] = await Promise.all(
    assets
      .filter(a => a.is_visible !== false && a.path)
      .sort((a, b) => a.position - b.position)
      .map(async (a) => ({
        name: a.title || '',
        url: a.link || undefined,
        logo: await getMediaUrl(a.path!),
      }))
  );

  return (
    <>
      <InnerPageHeader />

      <main className="min-h-screen bg-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Наши партнеры
          </h1>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-6 max-w-7xl mx-auto">
            {partners.map((partner, index) => {
              const Wrapper = partner.url ? 'a' : 'div';

              return (
                <Wrapper
                  key={index}
                  {...(partner.url
                    ? {
                        href: partner.url,
                        target: '_blank',
                        rel: 'noopener noreferrer',
                      }
                    : {})}
                  className="flex items-center justify-center p-4 opacity-90 hover:opacity-100 transition-opacity"
                  aria-label={partner.name}
                >
                  <img
                    src={partner.logo}
                    alt={partner.name}
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
