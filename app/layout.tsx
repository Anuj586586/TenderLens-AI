import type {Metadata} from 'next';
import { Providers } from '@/lib/providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'TenderLens AI | AI-Powered Tender & RFP Analysis Software',
  description: 'Automate your RFP and tender analysis with TenderLens AI. Extract key requirements, identify risks instantly, and increase your bid win rates with our advanced bid intelligence platform.',
  keywords: ['Tender Analysis', 'RFP Software', 'Bid Intelligence', 'AI Tender Management', 'Contract Compliance'],
  openGraph: {
    title: 'TenderLens AI | AI-Powered Tender & RFP Analysis Software',
    description: 'Automate your RFP and tender analysis with TenderLens AI. Extract key requirements, identify risks instantly, and increase your bid win rates with our advanced bid intelligence platform.',
    type: 'website',
  }
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4202092943475144" crossOrigin="anonymous"></script>
      </head>
      <body className="antialiased bg-slate-50 text-slate-900 min-h-screen flex flex-col" suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
