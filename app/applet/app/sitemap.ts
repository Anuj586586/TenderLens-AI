import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  // Use custom domain if set, otherwise fallback to the preview URL
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ais-pre-gk7d2dhqnsl6d2tucwoeew-609486323980.asia-east1.run.app';
  
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/dashboard`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ];
}
