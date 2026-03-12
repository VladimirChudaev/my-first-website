import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  // Замените на ваш реальный домен, когда он будет привязан
  const baseUrl = 'https://my-first-website-git-feature-admin-vladimir-s-projects-5e28ba50.vercel.app'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin',      // Закрываем админку
        '/api',        // Закрываем внутренние запросы
        '/auth',       // Закрываем страницы входа/регистрации
        '/protected',  // Закрываем защищенные роуты
        '/_next',      // Закрываем служебные файлы Next.js
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}