import type { MetadataRoute } from 'next';
import { headers } from 'next/headers';

// Este proyecto sirve dos sitios: zenkai.fortisworkout.org y endurance.fortisworkout.org.
// Cada uno publica su propio robots.txt y su propio sitemap según el dominio con que entren.
export default async function robots(): Promise<MetadataRoute.Robots> {
  const host = ((await headers()).get('host') || '').toLowerCase();

  if (host.startsWith('endurance.')) {
    return {
      rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/baja'] },
      sitemap: 'https://endurance.fortisworkout.org/sitemap.xml',
    };
  }

  if (host.startsWith('zenkai.')) {
    return {
      rules: {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin', '/dashboard', '/checkout', '/curso', '/endurance'],
      },
      sitemap: 'https://zenkai.fortisworkout.org/sitemap.xml',
    };
  }

  // Cualquier otra dirección (por ejemplo zenkaiacademyone.netlify.app) no se rastrea:
  // las versiones oficiales son los dos subdominios.
  return { rules: { userAgent: '*', disallow: '/' } };
}
