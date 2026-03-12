import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://my-first-website-git-feature-admin-vladimir-s-projects-5e28ba50.vercel.app';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/auth'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}