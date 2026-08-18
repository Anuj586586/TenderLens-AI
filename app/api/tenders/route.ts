import { NextRequest, NextResponse } from 'next/server';

function getCategory(title: string, description: string) {
  const text = `${title} ${description}`.toLowerCase();
  if (text.match(/software|it |technology|cloud|data|cyber|computer|server|digital|network|website|ai |bot |app |system/)) return 'it';
  if (text.match(/construction|building|renovation|plumbing|hvac|roof|infrastructure|road|estate|facilities|maintenance/)) return 'construction';
  if (text.match(/marketing|advertising|pr |public relations|media|campaign|social media|seo|communication/)) return 'marketing';
  return 'other';
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const region = searchParams.get('region') || 'uk';
    const category = searchParams.get('category')?.toLowerCase() || 'all';

    let allTenders: any[] = [];

    if (region === 'global') {
      const response = await fetch('https://search.worldbank.org/api/v2/projects?format=json', {
        next: { revalidate: 3600 }
      });
      if (!response.ok) throw new Error('World Bank API failed');
      const data = await response.json();
      
      allTenders = Object.keys(data.projects).map(key => {
        const p = data.projects[key];
        return {
          id: p.id,
          title: p.project_name || 'Untitled Project',
          buyer: `World Bank (${p.countryshortname})`,
          description: `Sector: ${p.sector1?.Name || 'N/A'}. Managed by: ${p.teamleadname || 'N/A'}`,
          value: `USD ${Number(p.totalamt || 0).toLocaleString()}`,
          deadline: p.closingdate ? new Date(p.closingdate).toLocaleDateString() : 'N/A',
          publishedDate: p.boardapprovaldate ? new Date(p.boardapprovaldate) : new Date(0),
          url: p.url || `https://projects.worldbank.org/en/projects-operations/project-detail/${p.id}`
        };
      });
    } else if (region === 'india') {
      const response = await fetch('https://search.worldbank.org/api/v2/projects?format=json&countryshortname_exact=India', {
        next: { revalidate: 3600 }
      });
      if (!response.ok) throw new Error('World Bank India API failed');
      const data = await response.json();
      
      allTenders = Object.keys(data.projects).map(key => {
        const p = data.projects[key];
        return {
          id: p.id,
          title: p.project_name || 'Untitled Project',
          buyer: `Government of India / World Bank`,
          description: `Sector: ${p.sector1?.Name || 'N/A'}. Managed by: ${p.teamleadname || 'N/A'}`,
          value: `USD ${Number(p.totalamt || 0).toLocaleString()}`,
          deadline: p.closingdate ? new Date(p.closingdate).toLocaleDateString() : 'N/A',
          publishedDate: p.boardapprovaldate ? new Date(p.boardapprovaldate) : new Date(0),
          url: p.url || `https://projects.worldbank.org/en/projects-operations/project-detail/${p.id}`
        };
      });
    } else if (region === 'usa') {
      const response = await fetch('https://api.usaspending.gov/api/v2/search/spending_by_award/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filters: { award_type_codes: ["A", "B", "C", "D"] },
          fields: ["Award ID", "Recipient Name", "Description", "Award Amount", "End Date", "Start Date"],
          sort: "Start Date",
          order: "desc",
          limit: 100
        }),
        next: { revalidate: 3600 }
      });
      if (!response.ok) throw new Error('USASpending API failed');
      const data = await response.json();
      
      allTenders = (data.results || []).map((p: any, idx: number) => {
        return {
          id: String(p["Award ID"] || idx),
          title: p.Description || 'US Federal Contract Award',
          buyer: 'US Federal Government',
          description: `Federal contract awarded to ${p["Recipient Name"]}.`,
          value: p["Award Amount"] ? `USD ${Number(p["Award Amount"]).toLocaleString()}` : 'N/A',
          deadline: p["End Date"] ? new Date(p["End Date"]).toLocaleDateString() : 'N/A',
          publishedDate: p["Start Date"] ? new Date(p["Start Date"]) : new Date(0),
          url: 'https://www.usaspending.gov/search'
        };
      });
    } else {
      // Default to UK Contracts Finder
      const response = await fetch('https://www.contractsfinder.service.gov.uk/Published/Notices/OCDS/Search?limit=100', {
        headers: { 'Accept': 'application/json' },
        next: { revalidate: 3600 } 
      });

      if (!response.ok) throw new Error(`UK API failed: ${response.status}`);
      const data = await response.json();
      
      const uniqueTenders = new Map();
      data.releases?.forEach((release: any) => {
        const t = release.tender || {};
        const b = release.buyer || {};
        const id = t.id || release.id;
        
        if (!uniqueTenders.has(id)) {
          const noticeId = release.id ? release.id.substring(0, 36) : '';
          uniqueTenders.set(id, {
            id: id,
            title: t.title || 'Untitled Tender',
            buyer: b.name || 'Unknown Buyer',
            description: t.description || 'No description available',
            value: t.value ? `${t.value.currency || 'GBP'} ${t.value.amount?.toLocaleString() || '0'}` : 'N/A',
            deadline: t.tenderPeriod?.endDate ? new Date(t.tenderPeriod.endDate).toLocaleDateString() : 'N/A',
            publishedDate: release.date ? new Date(release.date) : new Date(0),
            url: noticeId ? `https://www.contractsfinder.service.gov.uk/Notice/${noticeId}` : '#'
          });
        }
      });
      allTenders = Array.from(uniqueTenders.values());
    }

    // Sort by publishedDate descending
    allTenders.sort((a, b) => b.publishedDate.getTime() - a.publishedDate.getTime());

    // Apply AI Matchmaking logic to REAL data
    const filtered = category === 'all' 
      ? allTenders 
      : allTenders.filter(t => getCategory(t.title, t.description) === category);

    return NextResponse.json({ tenders: filtered });

  } catch (error: any) {
    console.error("API proxy error:", error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

