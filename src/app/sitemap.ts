import type { MetadataRoute } from 'next';
import { headers } from 'next/headers';

const ZENKAI = 'https://zenkai.fortisworkout.org';
const ENDURANCE = 'https://endurance.fortisworkout.org';

// Un sitemap por dominio (ver robots.ts). Agrega aquí las páginas nuevas de cada sitio.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const host = ((await headers()).get('host') || '').toLowerCase();
  const now = new Date();

  if (host.startsWith('endurance.')) {
    return [
      { url: `${ENDURANCE}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
      { url: `${ENDURANCE}/reglamento`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
      { url: `${ENDURANCE}/exoneracion`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
      { url: `${ENDURANCE}/privacidad`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    ];
  }

  if (host.startsWith('zenkai.')) {
    return [
      { url: `${ZENKAI}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
      { url: `${ZENKAI}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
      { url: `${ZENKAI}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    ];
  }

  return [];
}
