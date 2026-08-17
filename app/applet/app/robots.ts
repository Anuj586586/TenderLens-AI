import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ais-pre-gk7d2dhqnsl6d2tucwoeew-609486323980.asia-east1.run.app';
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/dashboard/settings'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
