import { NextResponse } from 'next/server';
import { getAllOutcodes, getAllCities } from "@/lib/dampData";
import { getSeoDates } from "@/lib/seoDates";
import { guidesData } from "@/lib/guidesData";
import { POPULAR_COMPARE_PAIRS } from "@/lib/comparePairs";

export const revalidate = 86400; // ISR Cache 1 day on CDN

const baseUrl = 'https://checkdamp.co.uk';

export async function generateStaticParams() {
  return [
    { id: 'static.xml' },
    { id: 'outcodes.xml' },
    { id: 'compare.xml' },
    { id: 'guides.xml' },
    { id: 'cities.xml' },
  ];
}

const escapeXml = (unsafe: string) => {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
};

function buildXmlSitemap(routes: Array<{ url: string; lastModified: string; changeFrequency?: string; priority?: number }>) {
  const xmlEntries = routes.map(r => `
    <url>
      <loc>${escapeXml(r.url)}</loc>
      <lastmod>${r.lastModified}</lastmod>
      <changefreq>${r.changeFrequency || 'weekly'}</changefreq>
      <priority>${r.priority || 0.7}</priority>
    </url>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlEntries}
</urlset>`.trim();
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const cleanId = id.replace('.xml', '');

  let routes: Array<{ url: string; lastModified: string; changeFrequency?: string; priority?: number }> = [];

  // 1. STATIC PAGES
  if (cleanId === 'static') {
    routes = [
      '', '/damp-risk', '/cities', '/compare', '/guides', '/about', '/contact', '/privacy', '/terms'
    ].map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: getSeoDates(route || 'homepage').dateModifiedISO,
      changeFrequency: 'monthly',
      priority: route === '' ? 1.0 : 0.7,
    }));
  }

  // 2. ALL OUTCODES (SSG reading from dampData.json)
  else if (cleanId === 'outcodes') {
    const outcodes = getAllOutcodes();
    routes = outcodes.map((code) => ({
      url: `${baseUrl}/damp-risk/${code.toLowerCase()}`,
      lastModified: getSeoDates(code).dateModifiedISO,
      changeFrequency: 'weekly',
      priority: 0.9,
    }));
  }

  // 3. COMPARISON PAIRS
  else if (cleanId === 'compare') {
    routes = POPULAR_COMPARE_PAIRS.map((pair) => ({
      url: `${baseUrl}/compare/${pair}`,
      lastModified: getSeoDates(pair).dateModifiedISO,
      changeFrequency: 'weekly',
      priority: 0.8,
    }));
  }

  // 4. CITIES HUBS
  else if (cleanId === 'cities') {
    const cities = getAllCities();
    routes = [
      {
        url: `${baseUrl}/cities`,
        lastModified: getSeoDates('cities-directory').dateModifiedISO,
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      ...cities.map((city) => ({
        url: `${baseUrl}/cities/${city.toLowerCase()}`,
        lastModified: getSeoDates(city.toLowerCase()).dateModifiedISO,
        changeFrequency: 'weekly',
        priority: 0.9,
      }))
    ];
  }

  // 5. GUIDES
  else if (cleanId === 'guides') {
    routes = [
      {
        url: `${baseUrl}/guides`,
        lastModified: getSeoDates('guides-hub').dateModifiedISO,
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      ...guidesData.map((guide) => ({
        url: `${baseUrl}/guides/${guide.slug}`,
        lastModified: guide.dateModified,
        changeFrequency: 'weekly',
        priority: 0.8,
      }))
    ];
  }

  if (routes.length === 0) {
    return new NextResponse('Sitemap Not Found', { status: 404 });
  }

  const xml = buildXmlSitemap(routes);

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800'
    }
  });
}