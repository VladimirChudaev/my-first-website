export const dynamic = 'force-dynamic';

import InnerPageHeader from '@/components/InnerPageHeader';
import { PartnersService, PartnerDTO } from '@/lib/services/PartnersService';

export default async function PartnersPage() {
  console.log('--- [UI] Запрос страницы партнеров начат ---');

  let partners: PartnerDTO[] = [];
  
  try {
    partners = await PartnersService.getVisiblePartners();
    console.log(`--- [UI] Успешно получено партнеров: ${partners.length} ---`);
  } catch (error) {
    console.error('--- [UI] Ошибка при загрузке партнеров:', error);
  }

  return (
    <>
      <InnerPageHeader />

      <main className="min-h-screen bg-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Наши партнеры
          </h1>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-6 max-w-7xl mx-auto">
            {partners.map((p: PartnerDTO) => {
              const Wrapper: any = p.websiteUrl ? 'a' : 'div';

              return (
                <Wrapper
                  key={p.id}
                  {...(p.websiteUrl
                    ? {
                        href: p.websiteUrl,
                        target: '_blank',
                        rel: 'noopener noreferrer',
                      }
                    : {})}
                  className="flex items-center justify-center p-4 opacity-90 hover:opacity-100 transition-opacity"
                  aria-label={p.name}
                >
                  <img
                    src={p.logoUrl}
                    alt={p.name}
                    className="max-h-16 w-auto object-contain"
                    loading="lazy"
                  />
                </Wrapper>
              );
            })}
          </div>
          {partners.length === 0 && (
            <p className="text-center text-gray-500">Партнеры не найдены или загружаются...</p>
          )}
        </div>
      </main>
    </>
  );
}