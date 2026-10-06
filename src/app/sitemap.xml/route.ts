import { NextResponse } from 'next/server';

export const revalidate = 86400;

export async function GET() {
  const baseUrl = 'https://checkdamp.co.uk';

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <sitemap>
      <loc>${baseUrl}/sitemap/static.xml</loc>
    </sitemap>
    <sitemap>
      <loc>${baseUrl}/sitemap/outcodes.xml</loc>
    </sitemap>
    <sitemap>
      <loc>${baseUrl}/sitemap/cities.xml</loc>
    </sitemap>
    <sitemap>
      <loc>${baseUrl}/sitemap/compare.xml</loc>
    </sitemap>
    <sitemap>
      <loc>${baseUrl}/sitemap/guides.xml</loc>
    </sitemap>
  </sitemapindex>`.trim();

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800'
    },
  });
}