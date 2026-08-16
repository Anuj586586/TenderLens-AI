import { NextResponse } from 'next/server';

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1541888086425-d81bb19240f5?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=600',
];

const MOCK_FALLBACK = [
  {
    id: 1,
    title: 'Top 5 Changes to EU Public Procurement Laws in 2026',
    excerpt: 'Understand how the new directive affects tech and construction tenders across member states starting next month.',
    date: 'Aug 16, 2026',
    category: 'Policy & Compliance',
    readTime: '6 min read',
    url: 'https://commission.europa.eu/index_en',
    image: FALLBACK_IMAGES[0]
  },
  {
    id: 2,
    title: 'How AI is Transforming the Bid Writing Process',
    excerpt: 'Discover how top agencies are using generative AI to cut RFP response times by 40% while improving win rates.',
    date: 'Aug 15, 2026',
    category: 'Technology',
    readTime: '4 min read',
    url: 'https://www.weforum.org/',
    image: FALLBACK_IMAGES[1]
  },
  {
    id: 3,
    title: 'US Infrastructure Bill: What it Means for Small Contractors',
    excerpt: 'A deep dive into the set-aside grants and simplified bidding processes introduced in the latest federal infrastructure package.',
    date: 'Aug 14, 2026',
    category: 'Market Insights',
    readTime: '8 min read',
    url: 'https://www.transportation.gov/bipartisan-infrastructure-law',
    image: FALLBACK_IMAGES[2]
  },
  {
    id: 99,
    title: 'India GeM Portal Upgrades: Simplifying Tenders for Tech SMEs',
    excerpt: 'India’s Government e-Marketplace (GeM) introduces automated compliance checks and faster payment cycles for IT & construction contractors.',
    date: 'Aug 13, 2026',
    category: 'Regional Updates',
    readTime: '4 min read',
    url: 'https://gem.gov.in/',
    image: FALLBACK_IMAGES[4]
  },
  {
    id: 4,
    title: 'Sustainability Requirements are Now Mandatory for UK Gov Contracts',
    excerpt: 'If you are bidding for contracts over £5m, you must provide a Carbon Reduction Plan. Here is how to prepare.',
    date: 'Aug 12, 2026',
    category: 'Compliance',
    readTime: '5 min read',
    url: 'https://www.gov.uk/government/publications/procurement-policy-note-0621-taking-account-of-carbon-reduction-plans-in-the-procurement-of-major-government-contracts',
    image: FALLBACK_IMAGES[3]
  },
  {
    id: 5,
    title: 'Cybersecurity Certifications: The New Gateway to Defense Contracts',
    excerpt: 'An overview of the CMMC 2.0 framework and what it means for SMEs looking to bid on defense and intelligence tenders.',
    date: 'Aug 10, 2026',
    category: 'Security',
    readTime: '7 min read',
    url: 'https://dodcio.defense.gov/CMMC/',
    image: FALLBACK_IMAGES[4]
  },
  {
    id: 6,
    title: 'Top 10 Fast-Growing Sectors in Government Procurement',
    excerpt: 'From EV charging infrastructure to telehealth services, discover where governments are directing their largest budgets this year.',
    date: 'Aug 08, 2026',
    category: 'Market Insights',
    readTime: '5 min read',
    url: 'https://www.mckinsey.com/industries/public-sector/our-insights',
    image: FALLBACK_IMAGES[5]
  },
  {
    id: 7,
    title: 'Understanding the Open Contracting Data Standard (OCDS)',
    excerpt: 'How standardized open data is increasing transparency and making it easier to discover hidden contract opportunities globally.',
    date: 'Aug 05, 2026',
    category: 'Technology',
    readTime: '6 min read',
    url: 'https://standard.open-contracting.org/latest/en/',
    image: FALLBACK_IMAGES[0]
  },
  {
    id: 8,
    title: 'Best Practices for Teaming Agreements in Joint Bids',
    excerpt: 'Partnering with other companies can help you win larger contracts. Here is how to structure a successful teaming agreement.',
    date: 'Aug 02, 2026',
    category: 'Strategy',
    readTime: '9 min read',
    url: 'https://www.sba.gov/federal-contracting/contracting-guide/size-standards',
    image: FALLBACK_IMAGES[1]
  }
];

export async function GET() {
  try {
    // Fetch live news via rss2json converter from Google News Search
    const rssUrl = encodeURIComponent('https://news.google.com/rss/search?q=public+procurement+OR+government+contracts+OR+tender+awards+OR+federal+awards+USA+India&hl=en-US&gl=US&ceid=US:en');
    const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}`, {
      next: { revalidate: 1800 } // Cache for 30 minutes to stay updated but prevent rate-limiting
    });

    if (!response.ok) {
      throw new Error('RSS fetch failed');
    }

    const data = await response.json();
    
    // Fallback if the free RSS service quota is exceeded
    if (!data.items || data.status !== 'ok') {
       return NextResponse.json({ blogs: MOCK_FALLBACK });
    }

    // Map real Google News items to our blog schema
    const blogs = data.items.slice(0, 12).map((item: any, index: number) => {
      let excerpt = item.description || '';
      // Strip HTML tags returned by Google News
      excerpt = excerpt.replace(/(<([^>]+)>)/gi, "");
      
      // Some RSS items duplicate the title in the description, trim it nicely
      if (excerpt.length > 150) {
        excerpt = excerpt.substring(0, 150) + '...';
      }
      
      return {
        id: index,
        title: item.title,
        excerpt: excerpt || 'Read the full article for more detailed insights and updates on this recent public procurement news.',
        date: new Date(item.pubDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        category: 'Market News',
        readTime: `${Math.floor(Math.random() * 4) + 3} min read`,
        url: item.link,
        image: FALLBACK_IMAGES[index % FALLBACK_IMAGES.length]
      };
    });

    return NextResponse.json({ blogs });
  } catch (error) {
    console.error('Error fetching live blogs, using fallback:', error);
    // Graceful fallback to guarantee UI always works
    return NextResponse.json({ blogs: MOCK_FALLBACK });
  }
}
