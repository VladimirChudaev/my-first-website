import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Пока используем технический адрес Vercel
  const baseUrl = 'https://my-first-website-git-feature-admin-vladimir-s-projects-5e28ba50.vercel.app'

  // 1. Основные статичные страницы сайта
  const staticPages = [
    '',               // Главная
    '/projects',      // Каталог проектов
    '/news',          // Новости
    '/partners',      // Партнеры
    '/film-reserve',  // Резерв (B2B раздел)
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8, // Главная важнее всего
  }))

  // 2. В будущем здесь будет fetch-запрос к вашей БД (Supabase), 
  // чтобы автоматически добавлять страницы новостей [slug]
  // Пока возвращаем только основные разделы
  
  return [...staticPages]
}