import type { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/config/constants';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/about',
    '/work',
    '/blog',
    '/contact',
    '/privacy',
  ];

  return routes.map((route) => ({
    url: `${SITE_CONFIG.url}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'weekly' : 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }));
}
