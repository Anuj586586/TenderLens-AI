import type { Metadata } from 'next';
import { Providers } from '@/lib/providers';
import { GoogleGenAI } from '@google/genai';
import { unstable_cache } from 'next/cache';
import './globals.css';

const getTrendingMetadata = unstable_cache(
  async () => {
    let title = 'TenderLens AI | AI-Powered Tender & RFP Analysis Software';
    let description = 'Automate your RFP and tender analysis with TenderLens AI. Extract key requirements, identify risks instantly, and increase your bid win rates with our advanced bid intelligence platform.';
    
    try {
      if (process.env.GEMINI_API_KEY) {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const prompt = `You are an SEO expert. Write a compelling, highly-optimized SEO title (under 60 chars) and meta description (under 160 chars) for an AI-powered Tender & RFP Analysis SaaS called "TenderLens AI". 
        Incorporate today's trends in government contracting, enterprise procurement, AI automation, or B2B software to make it extremely relevant and fresh.
        Return the result as JSON with exactly two keys: "title" and "description". Do not use markdown blocks.`;
        
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            responseMimeType: "application/json"
          }
        });
        
        if (response.text) {
          const json = JSON.parse(response.text);
          if (json.title) title = json.title;
          if (json.description) description = json.description;
        }
      }
    } catch (error) {
      console.error("Failed to generate trending SEO metadata:", error);
    }
    return { title, description };
  },
  ['trending-seo-metadata'],
  { revalidate: 86400 } // Revalidate every 24 hours
);

export async function generateMetadata(): Promise<Metadata> {
  const dynamicMeta = await getTrendingMetadata();
  
  const title = process.env.APPLET_TITLE || dynamicMeta.title;
  const description = process.env.APPLET_DESCRIPTION || dynamicMeta.description;

  return {
    title,
    description,
    keywords: ['Tender Analysis', 'RFP Software', 'Bid Intelligence', 'AI Tender Management', 'Contract Compliance'],
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: 'TenderLens AI',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    }
  };
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-50 text-slate-900 min-h-screen flex flex-col" suppressHydrationWarning>
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "TenderLens AI",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "All",
            "description": "Automate your RFP and tender analysis with TenderLens AI. Extract key requirements, identify risks instantly, and increase your bid win rates.",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          })
        }} />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
