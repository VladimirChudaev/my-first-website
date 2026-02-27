import { PageContentRepository } from '@/lib/repositories/PageContentRepository'
import { mediaService } from '@/lib/services/MediaService'
import InnerPageHeader from '@/app/components/InnerPageHeader'
import FilmReserveForm from '@/components/film-reserve/FilmReserveForm'
import Image from 'next/image'

export default async function FilmReservePage() {
  // 1. Получаем текстовые блоки из БД
  const blocks = await PageContentRepository.getByPage('film-reserve')
  const intro = blocks.find((b: any) => b.section_key === 'intro')
  const legal = blocks.find((b: any) => b.section_key === 'legal')

  // 2. Получаем фото по категории 'film-reserve'
  let sideImageUrl = null
  try {
    const assets = await mediaService.getByCategory('film-reserve' as any)
    if (assets && assets.length > 0) {
      sideImageUrl = mediaService.getPublicUrl(assets[0].path ?? null)
    }
  } catch (e) {
    console.error('Ошибка загрузки фото:', e)
  }

  return (
    <main className="min-h-screen bg-white text-black">
      <InnerPageHeader />

      <div className="max-w-6xl mx-auto pt-40 pb-20 px-6">
        
        <h1 className="text-4xl font-light text-center mb-16 text-gray-800 tracking-tight">
          {intro?.title || 'Кинорезерв'}
        </h1>

        {/* ВЕРХНИЙ БЛОК */}
        <div className="grid md:grid-cols-2 gap-12 items-start mb-24">
          <div className="text-gray-700 text-[15px] leading-relaxed">
            {/* Исправленный вывод контента: добавлен prose и убран whitespace-pre-wrap */}
            <div 
              className="prose prose-sm max-w-none film-reserve-text prose-p:my-4 prose-p:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: intro?.body || 'Текст редактируется в админке...' }}
            />
          </div>
          
          <div className="relative aspect-video md:aspect-square w-full bg-gray-50 rounded-sm overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 shadow-sm border border-gray-100">
            {sideImageUrl ? (
               <Image 
                 src={sideImageUrl} 
                 alt="Film Reserve" 
                 fill 
                 className="object-cover"
                 sizes="(max-width: 768px) 100vw, 50vw"
                 priority
               />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-[10px] text-center px-10 uppercase tracking-widest">
                Изображение не выбрано в админке
              </div>
            )}
          </div>
        </div>

        {/* НИЖНИЙ БЛОК */}
        <div className="grid md:grid-cols-2 gap-20 border-t pt-16 border-gray-100">
          <div className="film-reserve-form-container">
            <FilmReserveForm legalSection={legal} />
          </div>

          <div className="space-y-10">
            <h2 className="text-4xl font-light italic text-gray-900">
              Связаться с нами
            </h2>
            
            <div className="space-y-6 text-gray-700">
              <p className="flex items-center gap-4">
                <span className="opacity-50">📞</span>
                <span className="text-base font-medium">+7 (922) 147 13 50</span>
              </p>
              <p className="flex items-center gap-4">
                <span className="opacity-50">✉️</span>
                <a href="mailto:producer@vtagency.ru" className="text-base font-medium underline underline-offset-4 decoration-gray-200 hover:decoration-black">
                  producer@vtagency.ru
                </a>
              </p>
              <div className="flex items-start gap-4 pt-4 text-sm leading-relaxed italic text-gray-500">
                <span className="not-italic">📍</span>
                <span>
                  Российская Федерация, Екатеринбург,<br />
                  улица Союзная, 2
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}