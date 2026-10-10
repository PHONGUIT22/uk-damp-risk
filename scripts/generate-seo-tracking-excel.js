/**
 * scripts/generate-seo-tracking-excel.js
 * 
 * Generates seo_tracking_master.xlsx with 5 organized sheets:
 * 1. 📚 Guides (14 Articles)
 * 2. 📍 Outcodes (253 pSEO)
 * 3. 🏙️ Cities & Comparisons
 * 4. 🌐 Static & Legal
 * 5. 📈 Weekly Performance Log
 */

const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const BASE_URL = 'https://checkdamp.co.uk';
const DATE_SUBMITTED = '2026-10-10';

// 1. Helper to extract 14 guides from src/lib/guidesData.ts
function extractGuides(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const parts = content.split(/\bslug:\s*["']/);
  const guides = [];

  for (let i = 1; i < parts.length; i++) {
    const block = parts[i];
    const slug = block.split(/["']/)[0];

    const getField = (field) => {
      const matchDouble = block.match(new RegExp(`${field}:\\s*"([^"]+)"`));
      if (matchDouble) return matchDouble[1];
      const matchSingle = block.match(new RegExp(`${field}:\\s*'([^']+)'`));
      return matchSingle ? matchSingle[1] : '';
    };

    const title = getField('title');
    const targetKeyword = getField('targetKeyword');
    const category = getField('category');
    const readingTime = getField('readingTime');
    const keyTakeaway = getField('keyTakeaway');

    guides.push({
      slug,
      title,
      targetKeyword,
      category,
      readingTime,
      keyTakeaway
    });
  }

  return guides;
}

// 2. Helper to extract comparison pairs from src/lib/comparePairs.ts
function extractComparePairs(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const match = content.match(/POPULAR_COMPARE_PAIRS\s*=\s*\[([\s\S]*?)\]\s*as\s*const/);
  if (!match) return [];
  return [...match[1].matchAll(/"([^"]+)"/g)].map(m => m[1]);
}

// 3. Helper to auto-fit worksheet column widths
function applyAutoFit(ws, data, headers) {
  const colWidths = headers.map(header => {
    let max = header.length;
    data.forEach(row => {
      const val = row[header];
      if (val !== undefined && val !== null) {
        const len = String(val).length;
        if (len > max) max = len;
      }
    });
    // Add 3 padding chars, bound between 12 and 65
    return { wch: Math.min(Math.max(max + 3, 12), 65) };
  });
  ws['!cols'] = colWidths;
}

function main() {
  const dampDataPath = path.join(__dirname, '../src/data/dampData.json');
  const guidesPath = path.join(__dirname, '../src/lib/guidesData.ts');
  const comparePath = path.join(__dirname, '../src/lib/comparePairs.ts');
  const outputPath = path.join(__dirname, '../seo_tracking_master.xlsx');

  console.log('Loading project data sources...');
  const dampData = JSON.parse(fs.readFileSync(dampDataPath, 'utf8'));
  const guides = extractGuides(guidesPath);
  const comparePairs = extractComparePairs(comparePath);

  const outcodeCityMap = new Map();
  dampData.forEach(item => {
    outcodeCityMap.set(item.outcode.toUpperCase(), item.city);
  });

  const workbook = XLSX.utils.book_new();

  // =========================================================================
  // SHEET 1: 📚 Guides (14 Articles)
  // =========================================================================
  const guidesHeaders = [
    'URL',
    'Topic_Cluster',
    'Article_Title',
    'Target_Keyword',
    'Reading_Time',
    'Quick_Verdict_Takeaway',
    'GSC_Index_Status',
    'Date_Submitted',
    'Impressions_7D',
    'Clicks_7D',
    'Avg_Position',
    'Action_Plan'
  ];

  const guidesData = guides.map(g => {
    const isIndexed = g.slug === 'condensation-vs-rising-damp-how-to-tell-difference';
    let actionPlan = 'Monitor GSC crawl rate & initial query impressions';
    if (isIndexed) {
      actionPlan = 'Live on Google SERP; track Featured Snippet CTR and rankings';
    } else if (g.category === 'Damp Diagnostics') {
      actionPlan = 'Track diagnostic keyword impressions & internal link click-throughs';
    } else if (g.category === 'Legal & Regulations') {
      actionPlan = 'Monitor Awaab\'s Law & Section 11 tenant search traffic';
    } else if (g.category === 'Mitigation & Technology') {
      actionPlan = 'Track commercial product search queries (PIV / dehumidifier sizing)';
    } else if (g.category === 'Surveys & Property') {
      actionPlan = 'Monitor mortgage retention & independent survey buyer intent keywords';
    }

    return {
      URL: `${BASE_URL}/guides/${g.slug}`,
      Topic_Cluster: g.category,
      Article_Title: g.title,
      Target_Keyword: g.targetKeyword,
      Reading_Time: g.readingTime,
      Quick_Verdict_Takeaway: g.keyTakeaway,
      GSC_Index_Status: isIndexed ? 'Indexed' : 'Pending / Discovered',
      Date_Submitted: DATE_SUBMITTED,
      Impressions_7D: '',
      Clicks_7D: '',
      Avg_Position: '',
      Action_Plan: actionPlan
    };
  });

  const wsGuides = XLSX.utils.json_to_sheet(guidesData, { header: guidesHeaders });
  applyAutoFit(wsGuides, guidesData, guidesHeaders);
  XLSX.utils.book_append_sheet(workbook, wsGuides, '📚 Guides (14 Articles)');

  // =========================================================================
  // SHEET 2: 📍 Outcodes (253 pSEO)
  // =========================================================================
  const outcodesHeaders = [
    'URL',
    'Outcode',
    'City',
    'Damp_Risk_Score',
    'Risk_Level',
    'Solid_Wall_Pct',
    'Poor_EPC_Pct',
    'Est_Dew_Point_C',
    'GSC_Index_Status',
    'Date_Submitted',
    'Impressions_7D',
    'Clicks_7D',
    'Current_Position'
  ];

  const outcodesData = dampData.map(area => {
    const code = area.outcode.toUpperCase();
    return {
      URL: `${BASE_URL}/damp-risk/${area.outcode.toLowerCase()}`,
      Outcode: code,
      City: area.city || 'UK',
      Damp_Risk_Score: area.damp_risk_score !== undefined ? area.damp_risk_score : 0,
      Risk_Level: area.risk_level || 'Moderate',
      Solid_Wall_Pct: area.pct_solid_wall !== undefined ? `${area.pct_solid_wall}%` : 'N/A',
      Poor_EPC_Pct: area.pct_poor_epc !== undefined ? `${area.pct_poor_epc}%` : 'N/A',
      Est_Dew_Point_C: area.est_dew_point_c !== undefined ? `${area.est_dew_point_c}°C` : 'N/A',
      GSC_Index_Status: 'Pending / Discovered',
      Date_Submitted: DATE_SUBMITTED,
      Impressions_7D: '',
      Clicks_7D: '',
      Current_Position: ''
    };
  });

  const wsOutcodes = XLSX.utils.json_to_sheet(outcodesData, { header: outcodesHeaders });
  applyAutoFit(wsOutcodes, outcodesData, outcodesHeaders);
  XLSX.utils.book_append_sheet(workbook, wsOutcodes, '📍 Outcodes (253 pSEO)');

  // =========================================================================
  // SHEET 3: 🏙️ Cities & Comparisons
  // =========================================================================
  const citiesCompHeaders = [
    'URL',
    'Type',
    'Entity_Name',
    'Region',
    'Target_Keyword',
    'Summary',
    'GSC_Index_Status',
    'Impressions_7D',
    'Clicks_7D'
  ];

  const citiesCompData = [
    {
      URL: `${BASE_URL}/cities/birmingham`,
      Type: 'City Hub',
      Entity_Name: 'Birmingham Regional Hub',
      Region: 'Birmingham',
      Target_Keyword: 'birmingham damp risk index',
      Summary: 'Regional hub analyzing 68 Birmingham postcodes & Victorian solid masonry',
      GSC_Index_Status: 'Pending / Discovered',
      Impressions_7D: '',
      Clicks_7D: ''
    },
    {
      URL: `${BASE_URL}/cities/manchester`,
      Type: 'City Hub',
      Entity_Name: 'Manchester Regional Hub',
      Region: 'Manchester',
      Target_Keyword: 'manchester damp risk index',
      Summary: 'Regional hub analyzing 42 Manchester postcodes, high rainfall & terrace housing',
      GSC_Index_Status: 'Pending / Discovered',
      Impressions_7D: '',
      Clicks_7D: ''
    },
    {
      URL: `${BASE_URL}/cities/london`,
      Type: 'City Hub',
      Entity_Name: 'London Regional Hub',
      Region: 'London',
      Target_Keyword: 'london damp risk index',
      Summary: 'Regional hub analyzing 143 London postcodes & Victorian conversion flats',
      GSC_Index_Status: 'Pending / Discovered',
      Impressions_7D: '',
      Clicks_7D: ''
    }
  ];

  comparePairs.forEach(pair => {
    const parts = pair.split('-vs-');
    const c1 = parts[0] ? parts[0].toUpperCase() : '';
    const c2 = parts[1] ? parts[1].toUpperCase() : '';
    const city1 = outcodeCityMap.get(c1) || 'UK';
    const city2 = outcodeCityMap.get(c2) || 'UK';
    const region = city1 === city2 ? city1 : `${city1} vs ${city2}`;

    citiesCompData.push({
      URL: `${BASE_URL}/compare/${pair}`,
      Type: 'Comparison Pair',
      Entity_Name: `${c1} vs ${c2}`,
      Region: region,
      Target_Keyword: `${c1.toLowerCase()} vs ${c2.toLowerCase()} damp risk`,
      Summary: `Head-to-head comparative pathology analysis: ${c1} vs ${c2}`,
      GSC_Index_Status: 'Pending / Discovered',
      Impressions_7D: '',
      Clicks_7D: ''
    });
  });

  const wsCitiesComp = XLSX.utils.json_to_sheet(citiesCompData, { header: citiesCompHeaders });
  applyAutoFit(wsCitiesComp, citiesCompData, citiesCompHeaders);
  XLSX.utils.book_append_sheet(workbook, wsCitiesComp, '🏙️ Cities & Comparisons');

  // =========================================================================
  // SHEET 4: 🌐 Static & Legal
  // =========================================================================
  const staticHeaders = [
    'URL',
    'Page_Name',
    'Type',
    'Target_Keyword',
    'GSC_Status',
    'Notes'
  ];

  const staticData = [
    {
      URL: `${BASE_URL}/`,
      Page_Name: 'Homepage',
      Type: 'Core Landing',
      Target_Keyword: 'uk damp and mould risk index',
      GSC_Status: 'Indexed',
      Notes: 'Root brand hub, interactive postcode search, map & diagnostic tool'
    },
    {
      URL: `${BASE_URL}/damp-risk`,
      Page_Name: 'Outcodes Directory Hub',
      Type: 'Directory Hub',
      Target_Keyword: 'uk damp risk postcode directory',
      GSC_Status: 'Pending / Discovered',
      Notes: 'Comprehensive index directory linking to all 253 outcode profiles'
    },
    {
      URL: `${BASE_URL}/cities`,
      Page_Name: 'Cities Directory Hub',
      Type: 'Directory Hub',
      Target_Keyword: 'uk damp risk cities directory',
      GSC_Status: 'Pending / Discovered',
      Notes: 'Regional directory hub for Birmingham, Manchester, London'
    },
    {
      URL: `${BASE_URL}/compare`,
      Page_Name: 'Comparison Engine Hub',
      Type: 'Tool Hub',
      Target_Keyword: 'compare uk postcode damp risk',
      GSC_Status: 'Pending / Discovered',
      Notes: 'Head-to-head outcode comparison tool with side-by-side metrics'
    },
    {
      URL: `${BASE_URL}/guides`,
      Page_Name: 'Guides Library Hub',
      Type: 'Editorial Hub',
      Target_Keyword: 'uk damp mould condensation guides',
      GSC_Status: 'Pending / Discovered',
      Notes: 'Topical authority encyclopedia housing 14 peer-reviewed building pathology guides'
    },
    {
      URL: `${BASE_URL}/about`,
      Page_Name: 'About & Methodology',
      Type: 'E-E-A-T Trust',
      Target_Keyword: 'about checkdamp uk building pathology',
      GSC_Status: 'Pending / Discovered',
      Notes: 'Surveyor profile Dr. Arthur Pendelton AssocRICS, PCA diagnostic standards'
    },
    {
      URL: `${BASE_URL}/contact`,
      Page_Name: 'Contact & Surveyor Desk',
      Type: 'Trust & Support',
      Target_Keyword: 'contact checkdamp uk moisture diagnostics',
      GSC_Status: 'Pending / Discovered',
      Notes: 'Surveyor inquiry desk & homeowner quote assistance'
    },
    {
      URL: `${BASE_URL}/privacy`,
      Page_Name: 'Privacy Policy',
      Type: 'Legal Compliance',
      Target_Keyword: 'checkdamp privacy policy',
      GSC_Status: 'Pending / Discovered',
      Notes: 'UK GDPR & Data Protection Act 2018 policy disclosure'
    },
    {
      URL: `${BASE_URL}/terms`,
      Page_Name: 'Terms of Service',
      Type: 'Legal Compliance',
      Target_Keyword: 'checkdamp terms of service',
      GSC_Status: 'Pending / Discovered',
      Notes: 'Platform terms, medical & structural survey disclaimer'
    }
  ];

  const wsStatic = XLSX.utils.json_to_sheet(staticData, { header: staticHeaders });
  applyAutoFit(wsStatic, staticData, staticHeaders);
  XLSX.utils.book_append_sheet(workbook, wsStatic, '🌐 Static & Legal');

  // =========================================================================
  // SHEET 5: 📈 Weekly Performance Log
  // =========================================================================
  const perfHeaders = [
    'Week',
    'Total_Clicks',
    'Total_Impressions',
    'Average_CTR_Pct',
    'Average_Position',
    'Total_Indexed_URLs',
    'Key_Milestones_Notes'
  ];

  const perfData = [
    {
      Week: 'W1 (05/10 - 11/10/2026)',
      Total_Clicks: 0,
      Total_Impressions: 15,
      Average_CTR_Pct: '0.0%',
      Average_Position: 45.2,
      Total_Indexed_URLs: '2 / 287',
      Key_Milestones_Notes: 'Initial production deployment; XML sitemaps submitted to Google Search Console'
    },
    {
      Week: 'W2 (12/10 - 18/10/2026)',
      Total_Clicks: '',
      Total_Impressions: '',
      Average_CTR_Pct: '',
      Average_Position: '',
      Total_Indexed_URLs: '',
      Key_Milestones_Notes: 'Monitoring initial crawl rate & Discovery queues across 253 outcodes'
    },
    {
      Week: 'W3 (19/10 - 25/10/2026)',
      Total_Clicks: '',
      Total_Impressions: '',
      Average_CTR_Pct: '',
      Average_Position: '',
      Total_Indexed_URLs: '',
      Key_Milestones_Notes: 'First indexation wave evaluation (Birmingham & Manchester priority tiers)'
    },
    {
      Week: 'W4 (26/10 - 01/11/2026)',
      Total_Clicks: '',
      Total_Impressions: '',
      Average_CTR_Pct: '',
      Average_Position: '',
      Total_Indexed_URLs: '',
      Key_Milestones_Notes: 'Editorial guides topic cluster indexing & internal link propagation'
    },
    {
      Week: 'W5 (02/11 - 08/11/2026)',
      Total_Clicks: '',
      Total_Impressions: '',
      Average_CTR_Pct: '',
      Average_Position: '',
      Total_Indexed_URLs: '',
      Key_Milestones_Notes: 'SERP CTR analysis; review Snippet performance on high-intent queries'
    },
    {
      Week: 'W6 (09/11 - 15/11/2026)',
      Total_Clicks: '',
      Total_Impressions: '',
      Average_CTR_Pct: '',
      Average_Position: '',
      Total_Indexed_URLs: '',
      Key_Milestones_Notes: 'Comparison pair indexation & long-tail search volume tracking'
    },
    {
      Week: 'W7 (16/11 - 22/11/2026)',
      Total_Clicks: '',
      Total_Impressions: '',
      Average_CTR_Pct: '',
      Average_Position: '',
      Total_Indexed_URLs: '',
      Key_Milestones_Notes: 'Query performance review for Category 1 legal & surveyor topics'
    },
    {
      Week: 'W8 (23/11 - 29/11/2026)',
      Total_Clicks: '',
      Total_Impressions: '',
      Average_CTR_Pct: '',
      Average_Position: '',
      Total_Indexed_URLs: '',
      Key_Milestones_Notes: 'Monthly review: E-E-A-T score, lead quote submissions & backlink audit'
    }
  ];

  const wsPerf = XLSX.utils.json_to_sheet(perfData, { header: perfHeaders });
  applyAutoFit(wsPerf, perfData, perfHeaders);
  XLSX.utils.book_append_sheet(workbook, wsPerf, '📈 Weekly Performance Log');

  // =========================================================================
  // WRITE WORKBOOK TO ROOT
  // =========================================================================
  XLSX.writeFile(workbook, outputPath);

  console.log(`\n======================================================`);
  console.log(`✅ Multi-Sheet Excel Workbook generated successfully!`);
  console.log(`File Path: ${outputPath}`);
  console.log(`======================================================`);
  console.log(`Sheet 1: 📚 Guides (14 Articles)        -> ${guidesData.length} rows`);
  console.log(`Sheet 2: 📍 Outcodes (253 pSEO)          -> ${outcodesData.length} rows`);
  console.log(`Sheet 3: 🏙️ Cities & Comparisons        -> ${citiesCompData.length} rows (3 Hubs + 8 Pairs)`);
  console.log(`Sheet 4: 🌐 Static & Legal               -> ${staticData.length} rows`);
  console.log(`Sheet 5: 📈 Weekly Performance Log       -> ${perfData.length} rows`);
  console.log(`Total URLs Tracked Across Sheets:         ${guidesData.length + outcodesData.length + citiesCompData.length + staticData.length - 1} unique URLs`);
  console.log(`======================================================\n`);
}

main();
