/**
 * scripts/generate-seo-tracking-csv.js
 * 
 * Automated Master SEO Tracking CSV Generator for CheckDamp UK
 * Generates seo_tracking_master.csv at the repository root.
 */

const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://checkdamp.co.uk';
const DATE_DEPLOYED = '2026-10-10';

// 1. Helper for RFC 4180 CSV escaping
function escapeCsv(value) {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

// 2. Extract Guides from src/lib/guidesData.ts
function extractGuides(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const guideRegex = /slug:\s*"([^"]+)",[\s\S]*?title:\s*"([^"]+)",[\s\S]*?targetKeyword:\s*"([^"]+)",[\s\S]*?category:\s*"([^"]+)",[\s\S]*?readingTime:\s*"([^"]+)"/g;
  const guides = [];
  let match;
  while ((match = guideRegex.exec(content)) !== null) {
    const slug = match[1];
    const title = match[2];
    const targetKeyword = match[3];
    const category = match[4];
    const readingTime = match[5];

    // Find riskLevel within nearby block
    const segment = content.slice(match.index, match.index + 1200);
    const riskMatch = segment.match(/riskLevel:\s*"([^"]+)"/);
    const riskLevel = riskMatch ? riskMatch[1] : 'High Risk';

    guides.push({
      slug,
      title,
      targetKeyword,
      category,
      readingTime,
      riskLevel
    });
  }
  return guides;
}

// 3. Extract Comparison Pairs from src/lib/comparePairs.ts
function extractComparePairs(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const match = content.match(/POPULAR_COMPARE_PAIRS\s*=\s*\[([\s\S]*?)\]\s*as\s*const/);
  if (!match) return [];
  return [...match[1].matchAll(/"([^"]+)"/g)].map(m => m[1]);
}

function main() {
  const dampDataPath = path.join(__dirname, '../src/data/dampData.json');
  const guidesPath = path.join(__dirname, '../src/lib/guidesData.ts');
  const comparePath = path.join(__dirname, '../src/lib/comparePairs.ts');
  const outputPath = path.join(__dirname, '../seo_tracking_master.csv');

  console.log('Reading project data sources...');
  const dampData = JSON.parse(fs.readFileSync(dampDataPath, 'utf8'));
  const guides = extractGuides(guidesPath);
  const comparePairs = extractComparePairs(comparePath);

  // Map outcodes to city for pair lookup
  const outcodeCityMap = new Map();
  dampData.forEach(item => {
    outcodeCityMap.set(item.outcode.toUpperCase(), item.city);
  });

  const rows = [];

  // =========================================================================
  // SECTION 1: STATIC & HUB PAGES (12 Pages)
  // =========================================================================
  const staticPages = [
    {
      url: `${BASE_URL}/`,
      pageType: 'Homepage',
      entityId: 'Homepage',
      region: 'UK National',
      keyword: 'uk damp and mould risk index',
      summary: 'National Postcode Risk Index & Assessment Tool',
      status: 'Indexed',
      dateIndexed: DATE_DEPLOYED
    },
    {
      url: `${BASE_URL}/damp-risk`,
      pageType: 'Static Hub',
      entityId: 'damp-risk',
      region: 'UK National',
      keyword: 'uk damp risk postcode directory',
      summary: 'Directory Hub covering 253 Postcode Outcodes',
      status: 'Pending / Discovered',
      dateIndexed: ''
    },
    {
      url: `${BASE_URL}/cities`,
      pageType: 'Static Hub',
      entityId: 'cities',
      region: 'UK National',
      keyword: 'uk damp risk cities directory',
      summary: 'Regional Hub covering Birmingham, Manchester, London',
      status: 'Pending / Discovered',
      dateIndexed: ''
    },
    {
      url: `${BASE_URL}/cities/birmingham`,
      pageType: 'City Hub',
      entityId: 'birmingham',
      region: 'Birmingham',
      keyword: 'birmingham damp and mould risk',
      summary: 'City Hub with Victorian solid brick housing analysis',
      status: 'Pending / Discovered',
      dateIndexed: ''
    },
    {
      url: `${BASE_URL}/cities/manchester`,
      pageType: 'City Hub',
      entityId: 'manchester',
      region: 'Manchester',
      keyword: 'manchester damp and mould risk',
      summary: 'City Hub with terrace & high humidity rainfall analysis',
      status: 'Pending / Discovered',
      dateIndexed: ''
    },
    {
      url: `${BASE_URL}/cities/london`,
      pageType: 'City Hub',
      entityId: 'london',
      region: 'London',
      keyword: 'london damp and mould risk',
      summary: 'City Hub with Victorian & Edwardian flat analysis',
      status: 'Pending / Discovered',
      dateIndexed: ''
    },
    {
      url: `${BASE_URL}/compare`,
      pageType: 'Static Hub',
      entityId: 'compare',
      region: 'UK National',
      keyword: 'compare uk postcode damp risk',
      summary: 'Postcode Comparison Matrix & Tool',
      status: 'Pending / Discovered',
      dateIndexed: ''
    },
    {
      url: `${BASE_URL}/guides`,
      pageType: 'Static Hub',
      entityId: 'guides',
      region: 'UK National',
      keyword: 'uk damp mould condensation guides',
      summary: 'Editorial Library of 14 Expert Pathology Guides',
      status: 'Pending / Discovered',
      dateIndexed: ''
    },
    {
      url: `${BASE_URL}/about`,
      pageType: 'Static Hub',
      entityId: 'about',
      region: 'UK National',
      keyword: 'about checkdamp uk building pathology',
      summary: 'E-E-A-T Editorial Methodology & Surveyor Profile',
      status: 'Pending / Discovered',
      dateIndexed: ''
    },
    {
      url: `${BASE_URL}/contact`,
      pageType: 'Static Hub',
      entityId: 'contact',
      region: 'UK National',
      keyword: 'contact checkdamp uk moisture diagnostics',
      summary: 'Surveyor Enquiries & Support',
      status: 'Pending / Discovered',
      dateIndexed: ''
    },
    {
      url: `${BASE_URL}/privacy`,
      pageType: 'Static Hub',
      entityId: 'privacy',
      region: 'UK National',
      keyword: 'checkdamp privacy policy',
      summary: 'GDPR & Data Protection Compliance',
      status: 'Pending / Discovered',
      dateIndexed: ''
    },
    {
      url: `${BASE_URL}/terms`,
      pageType: 'Static Hub',
      entityId: 'terms',
      region: 'UK National',
      keyword: 'checkdamp terms of service',
      summary: 'Terms & Conditions of Service',
      status: 'Pending / Discovered',
      dateIndexed: ''
    }
  ];

  staticPages.forEach(p => {
    rows.push({
      url: p.url,
      pageType: p.pageType,
      entityId: p.entityId,
      region: p.region,
      keyword: p.keyword,
      summary: p.summary,
      status: p.status,
      dateDeployed: DATE_DEPLOYED,
      dateIndexed: p.dateIndexed
    });
  });

  // =========================================================================
  // SECTION 2: 253 OUTCODE PAGES (dampData.json)
  // =========================================================================
  dampData.forEach(area => {
    const code = area.outcode.toUpperCase();
    const city = area.city || 'UK';
    const score = area.damp_risk_score !== undefined ? area.damp_risk_score : 'N/A';
    const riskLevel = area.risk_level || 'Moderate';
    const solidWall = area.pct_solid_wall !== undefined ? `${area.pct_solid_wall}%` : 'N/A';
    const poorEpc = area.pct_poor_epc !== undefined ? `${area.pct_poor_epc}%` : 'N/A';
    const rh = area.avg_relative_humidity !== undefined ? `${area.avg_relative_humidity}%` : 'N/A';

    rows.push({
      url: `${BASE_URL}/damp-risk/${area.outcode.toLowerCase()}`,
      pageType: 'Outcode pSEO',
      entityId: code,
      region: city,
      keyword: `${code.toLowerCase()} damp and mould risk score`,
      summary: `Risk: ${score}/100 (${riskLevel}) | Solid Wall: ${solidWall} | Poor EPC: ${poorEpc} | RH: ${rh}`,
      status: 'Pending / Discovered',
      dateDeployed: DATE_DEPLOYED,
      dateIndexed: ''
    });
  });

  // =========================================================================
  // SECTION 3: 14 EDITORIAL GUIDES (guidesData.ts)
  // =========================================================================
  guides.forEach(guide => {
    const isIndexed = guide.slug === 'condensation-vs-rising-damp-how-to-tell-difference';
    rows.push({
      url: `${BASE_URL}/guides/${guide.slug}`,
      pageType: 'Guide Article',
      entityId: guide.slug,
      region: 'UK National',
      keyword: guide.targetKeyword,
      summary: `Category: ${guide.category} | Reading Time: ${guide.readingTime} | Risk: ${guide.riskLevel}`,
      status: isIndexed ? 'Indexed' : 'Pending / Discovered',
      dateDeployed: DATE_DEPLOYED,
      dateIndexed: isIndexed ? DATE_DEPLOYED : ''
    });
  });

  // =========================================================================
  // SECTION 4: 8 COMPARISON PAIRS (comparePairs.ts)
  // =========================================================================
  comparePairs.forEach(pair => {
    const parts = pair.split('-vs-');
    const c1 = parts[0] ? parts[0].toUpperCase() : '';
    const c2 = parts[1] ? parts[1].toUpperCase() : '';
    const city1 = outcodeCityMap.get(c1) || 'UK';
    const city2 = outcodeCityMap.get(c2) || 'UK';
    const region = city1 === city2 ? city1 : `${city1} vs ${city2}`;

    rows.push({
      url: `${BASE_URL}/compare/${pair}`,
      pageType: 'Comparison Pair',
      entityId: pair,
      region: region,
      keyword: `${c1.toLowerCase()} vs ${c2.toLowerCase()} damp risk comparison`,
      summary: `Head-to-head damp risk comparison: ${c1} vs ${c2}`,
      status: 'Pending / Discovered',
      dateDeployed: DATE_DEPLOYED,
      dateIndexed: ''
    });
  });

  // =========================================================================
  // SECTION 5: BUILD CSV CONTENT (RFC 4180 with UTF-8 BOM)
  // =========================================================================
  const headers = [
    'URL',
    'Page_Type',
    'Entity_Identifier',
    'Region_City',
    'Target_Keyword',
    'Technical_Data_Summary',
    'GSC_Index_Status',
    'Date_Deployed',
    'Date_Indexed',
    'Impressions_7D',
    'Clicks_7D',
    'Current_SERP_Position',
    'Optimization_Action'
  ];

  const csvLines = [headers.join(',')];

  rows.forEach(r => {
    const line = [
      escapeCsv(r.url),
      escapeCsv(r.pageType),
      escapeCsv(r.entityId),
      escapeCsv(r.region),
      escapeCsv(r.keyword),
      escapeCsv(r.summary),
      escapeCsv(r.status),
      escapeCsv(r.dateDeployed),
      escapeCsv(r.dateIndexed),
      '', // Impressions_7D
      '', // Clicks_7D
      '', // Current_SERP_Position
      ''  // Optimization_Action
    ].join(',');
    csvLines.push(line);
  });

  // UTF-8 BOM: \uFEFF for Excel and Google Sheets
  const csvContent = '\uFEFF' + csvLines.join('\r\n');
  fs.writeFileSync(outputPath, csvContent, 'utf8');

  console.log(`\n======================================================`);
  console.log(`✅ Master SEO Tracking CSV generated successfully!`);
  console.log(`File Path: ${outputPath}`);
  console.log(`======================================================`);
  console.log(`Total URLs Tracked:    ${rows.length}`);
  console.log(`- Static & Hub Pages:  ${staticPages.length}`);
  console.log(`- Outcodes (pSEO):     ${dampData.length}`);
  console.log(`- Guides Articles:     ${guides.length}`);
  console.log(`- Comparison Pairs:    ${comparePairs.length}`);
  console.log(`Total CSV Rows:        ${rows.length + 1} (including header)`);
  console.log(`======================================================\n`);
}

main();
