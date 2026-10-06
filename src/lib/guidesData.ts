export interface GuideArticle {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  targetKeyword: string;
  category: "Damp Diagnostics" | "Legal & Regulations" | "Mitigation & Technology" | "Surveys & Property";
  datePublished: string;
  dateModified: string;
  readingTime: string;
  quickVerdict: {
    riskLevel?: string;
    primaryCause?: string;
    recommendedSolution?: string;
    keyTakeaway: string;
  };
  contentHtml: string;
  faqItems: Array<{ question: string; answer: string }>;
  relatedOutcodes?: string[];
}

export const guidesData: GuideArticle[] = [
  // =========================================================================
  // GUIDE 1: CONDENSATION VS RISING DAMP
  // =========================================================================
  {
    slug: "condensation-vs-rising-damp-how-to-tell-difference",
    title: "Condensation vs Rising Damp: How to Tell the Difference & Avoid Misdiagnosis",
    metaTitle: "Condensation vs Rising Damp: How to Diagnose Accurately (2026)",
    metaDescription: "Learn how to accurately distinguish condensation from rising damp. Compare tide marks, black mould spores, dew points, and hygroscopic salt symptoms.",
    targetKeyword: "condensation vs rising damp",
    category: "Damp Diagnostics",
    datePublished: "2025-01-15T08:00:00Z",
    dateModified: "2026-10-04T08:00:00Z",
    readingTime: "8 min read",
    quickVerdict: {
      riskLevel: "High Risk of Costly Misdiagnosis",
      primaryCause: "Surface dew-point condensation vs ground capillary water pull",
      recommendedSolution: "Background heating & continuous extraction (PIV) vs physical/chemical DPC",
      keyTakeaway: "Over 75% of domestic damp complaints in UK pre-1930 homes are misdiagnosed as rising damp. If black mould is present, it is almost exclusively condensation: true rising damp contains nitrates and chlorides that inhibit mould spore germination."
    },
    relatedOutcodes: ["B21", "B11", "M14", "B10"],
    faqItems: [
      {
        question: "Can black mould grow on rising damp walls?",
        answer: "Almost never. True rising damp draws ground groundwater laden with dissolved mineral salts (nitrates and chlorides). These hygroscopic salts crystallise on the plaster surface and create an alkaline, saline environment that chemically inhibits Aspergillus and Stachybotrys mould germination. If you see fluffy black mould, you are dealing with surface condensation."
      },
      {
        question: "How high up a wall can rising damp travel?",
        answer: "Under standard UK atmospheric pressure and capillary pore diameters in clay bricks, true rising damp rarely exceeds 1.0 to 1.2 metres above external ground level. Any damp readings, tide marks, or peeling wallpaper found above 1.5 metres or on upper floors are physically caused by condensation, leaking rainwater goods, or penetrating damp."
      },
      {
        question: "Why do electrical prong moisture meters give false positives?",
        answer: "Standard electronic two-pin resistance meters measure electrical conductivity, not moisture content. If a wall has accumulated harmless mineral salts or foil-backed wallpaper, the meter will beep aggressively and register '99% wet' even on bone-dry plaster. The British Standard (BRE Digest 245) requires carbide bomb or gravimetric oven-drying tests to verify true rising damp."
      },
      {
        question: "Will installing a chemical damp-proof course (DPC) cure condensation?",
        answer: "No, injecting chemical siliconate fluid into the base of the brickwork does absolutely nothing to warm cold solid-brick surfaces or evacuate humid indoor air. Installing a chemical DPC on a condensation problem will cost £2,000–£5,000 and leave the mould completely untreated."
      }
    ],
    contentHtml: `
      <h2>The UK Damp Misdiagnosis Epidemic</h2>
      <p>
        Across British housing stock, an estimated <strong>75% of remedial damp-proofing works</strong> commissioned each year are entirely unnecessary. Homeowners, private tenants, and prospective buyers frequently receive alarming survey notices claiming their property suffers from structural "rising damp," followed by aggressive quotations for chemical damp-proof course (DPC) injections costing upwards of £3,500.
      </p>
      <p>
        In reality, the overwhelming majority of damp and mould issues in UK homes are caused by <strong>ambient condensation</strong> occurring on cold solid-wall masonry. Understanding the fundamental physics of moisture migration is the only way to avoid wasting thousands of pounds on inappropriate remedial treatments.
      </p>

      <h2>Key Diagnostic Differences: Side-by-Side Comparison</h2>
      <div class="overflow-x-auto my-6">
        <table class="w-full border-collapse border border-slate-200 text-sm">
          <thead>
            <tr class="bg-slate-900 text-white">
              <th class="p-3 text-left">Diagnostic Diagnostic Feature</th>
              <th class="p-3 text-left text-cyan-400">Surface Condensation</th>
              <th class="p-3 text-left text-amber-400">True Rising Damp</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            <tr>
              <td class="p-3 font-semibold">Black Mould Growth (*Aspergillus*)</td>
              <td class="p-3 text-emerald-700 font-bold">Very Common (Thrives on pure water droplets)</td>
              <td class="p-3 text-rose-700 font-bold">Extremely Rare (Inhibited by ground salts)</td>
            </tr>
            <tr>
              <td class="p-3 font-semibold">Height on Wall</td>
              <td class="p-3">Any height: ceiling corners, window reveals, behind beds</td>
              <td class="p-3">Strictly capped at 1.0m – 1.2m above external ground</td>
            </tr>
            <tr>
              <td class="p-3 font-semibold">Tide Marks & Salt Efflorescence</td>
              <td class="p-3">None. Wall may feel clammy without white crystals</td>
              <td class="p-3 font-bold text-amber-700">Pronounced horizontal tide mark with crusty white salts</td>
            </tr>
            <tr>
              <td class="p-3 font-semibold">Seasonal Severity</td>
              <td class="p-3">Spikes October to April when outdoor temps drop</td>
              <td class="p-3">Constant year-round, slightly exacerbated after heavy rain</td>
            </tr>
            <tr>
              <td class="p-3 font-semibold">Primary Root Cause</td>
              <td class="p-3">Inadequate ventilation + cold external walls below dew point</td>
              <td class="p-3">Breached or bridged DPC drawing subsoil groundwater</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>How Condensation Operates: The 12.8°C Dew Point Threshold</h2>
      <p>
        A typical UK family of three generates approximately <strong>10 to 15 litres of water vapour every single day</strong> through routine breathing, cooking, showering, and indoor laundry drying. In modernised homes fitted with double-glazed uPVC windows without trickle vents, this water vapour has no passive escape route.
      </p>
      <p>
        When warm, moisture-laden indoor air (at roughly 20°C and 65% relative humidity) comes into contact with an uninsulated solid brick wall (such as Victorian 9-inch brickwork prevalent in postcodes like B21 or M14), the air temperature immediately adjacent to the masonry drops. Once it falls below the <strong>12.8°C dew point</strong>, the air can no longer hold moisture in gas form, depositing liquid water droplets directly onto internal plaster. Within 48 hours, microscopic airborne mould spores germinate, producing visible black mould colonies.
      </p>

      <h2>How to Definitively Test Your Wall</h2>
      <ol class="space-y-3 my-4 list-decimal pl-5">
        <li><strong>The Foil Test:</strong> Tape a 30cm x 30cm square of kitchen aluminum foil tightly to the damp wall with duct tape around all four edges. Leave for 48 hours. If moisture droplets form on the <em>front</em> (room-facing) surface of the foil, the problem is 100% condensation. If droplets form on the <em>back</em> (wall-facing) surface, moisture is permeating through the masonry.</li>
        <li><strong>Quantitative Salt Analysis:</strong> An independent PCA surveyor will take plaster shavings from the base of the wall and test for chlorides and nitrates. Because tap water and condensation do not contain soil nitrates, the presence of nitrates proves groundwater ingress.</li>
        <li><strong>Relative Humidity Monitoring:</strong> Deploy digital thermo-hygrometers. If room humidity consistently sits above 60% RH during winter, condensation is guaranteed to occur regardless of ground DPC integrity.</li>
      </ol>
    `
  },

  // =========================================================================
  // GUIDE 2: AWAAB'S LAW
  // =========================================================================
  {
    slug: "awaabs-law-landlord-damp-mould-obligations-timeline",
    title: "Awaab's Law Explained: 2026 UK Landlord Damp & Mould Timelines & Legal Rights",
    metaTitle: "Awaab's Law: UK Landlord Damp & Mould Timelines (2026 Guide)",
    metaDescription: "Understand Awaab's Law and the Social Housing Regulation Act 2023. Mandatory 14-day investigation timescales, emergency hazards, and tenant legal rights.",
    targetKeyword: "awaabs law damp timeline landlord",
    category: "Legal & Regulations",
    datePublished: "2025-02-01T08:00:00Z",
    dateModified: "2026-10-04T08:00:00Z",
    readingTime: "7 min read",
    quickVerdict: {
      riskLevel: "Strict Legal Compliance Mandated",
      primaryCause: "Social Housing Regulation Act 2023 statutory response rules",
      recommendedSolution: "Formal written notice to landlord citing Awaab's Law timescales",
      keyTakeaway: "Under Awaab's Law, UK landlords must investigate reported damp and mould hazards within 14 calendar days, provide written findings within 48 hours, and begin repairs within 7 days. Emergency hazards threatening respiratory health must be tackled within 24 hours."
    },
    relatedOutcodes: ["M14", "M18", "B21", "B19"],
    faqItems: [
      {
        question: "What is Awaab's Law?",
        answer: "Awaab's Law was introduced under Section 42 of the Social Housing Regulation Act 2023 following the tragic death of two-year-old Awaab Ishak in Rochdale from prolonged environmental exposure to toxic black mould. It amends tenancy agreements by law, forcing social landlords to investigate and repair damp hazards within strict statutory timeframes."
      },
      {
        question: "What are the exact statutory deadlines under Awaab's Law?",
        answer: "Landlords must: (1) Investigate reported damp hazards within 14 calendar days; (2) Issue a written summary of findings and remedial action plan within 48 hours of inspection; (3) Begin physical remedial repairs within 7 calendar days; (4) Make emergency repairs within 24 hours if the hazard poses an imminent threat to life or severe health deterioration."
      },
      {
        question: "Does Awaab's Law apply to private rented sector (PRS) tenants?",
        answer: "Awaab's Law originally took effect for social housing providers (councils and housing associations). However, under the Renters' Rights Bill passing through Parliament in 2026, identical statutory damp and mould timescales are being extended to all private landlords across England and Wales."
      },
      {
        question: "Can landlords blame tenants for 'lifestyle condensation'?",
        answer: "No. The Housing Ombudsman and the Regulator of Social Housing have issued definitive guidance ordering landlords to cease attributing damp and mould to tenant 'lifestyle choices' (e.g. cooking or hanging laundry). Properties must be structurally capable of handling normal domestic habitation without developing mould hazards."
      }
    ],
    contentHtml: `
      <h2>The Legislative Background: The Legacy of Awaab Ishak</h2>
      <p>
        In December 2020, two-year-old Awaab Ishak died from severe respiratory failure caused by extensive, untreated black mould (*Stachybotrys chartarum*) in his family's housing association flat in Rochdale, Greater Manchester. Despite repeated complaints over several years, the landlord had repeatedly dismissed the family's concerns and blamed "lifestyle factors."
      </p>
      <p>
        The Senior Coroner's verdict triggered landmark legal reform, resulting in <strong>Awaab's Law</strong> embedded into the <em>Social Housing Regulation Act 2023</em>. The legislation completely transforms tenant rights and places strict, enforceable statutory obligations onto housing providers.
      </p>

      <h2>Statutory Response Timelines Every Tenant & Landlord Must Know</h2>
      <div class="my-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="p-5 rounded-2xl bg-rose-50 border border-rose-200">
          <span class="text-xs font-black uppercase text-rose-700 block">Phase 1: Initial Investigation</span>
          <h3 class="text-xl font-black text-slate-900 mt-1">14 Calendar Days</h3>
          <p class="text-xs text-slate-600 mt-2 leading-relaxed">
            From the moment a tenant reports damp, condensation, or mould, the landlord has exactly 14 calendar days to conduct a thorough on-site physical inspection.
          </p>
        </div>

        <div class="p-5 rounded-2xl bg-amber-50 border border-amber-200">
          <span class="text-xs font-black uppercase text-amber-800 block">Phase 2: Written Findings</span>
          <h3 class="text-xl font-black text-slate-900 mt-1">48 Hours</h3>
          <p class="text-xs text-slate-600 mt-2 leading-relaxed">
            Within 48 hours of completing the inspection, the landlord must provide the tenant with a written report detailing the root cause and a clear schedule of works.
          </p>
        </div>

        <div class="p-5 rounded-2xl bg-cyan-50 border border-cyan-200">
          <span class="text-xs font-black uppercase text-cyan-800 block">Phase 3: Commencement of Repairs</span>
          <h3 class="text-xl font-black text-slate-900 mt-1">7 Calendar Days</h3>
          <p class="text-xs text-slate-600 mt-2 leading-relaxed">
            Physical remedial works (such as installing mechanical extraction fans, repairing gutters, or applying thermal insulation) must commence within 7 days of the written report.
          </p>
        </div>

        <div class="p-5 rounded-2xl bg-red-50 border border-red-200">
          <span class="text-xs font-black uppercase text-red-700 block">Emergency Protocol</span>
          <h3 class="text-xl font-black text-slate-900 mt-1">24 Hours</h3>
          <p class="text-xs text-slate-600 mt-2 leading-relaxed">
            If the property presents an imminent health hazard—particularly to infants, elderly residents, or individuals with pre-existing asthma—repairs or decant rehousing must occur within 24 hours.
          </p>
        </div>
      </div>

      <h2>How Tenants Can Enforce Their Rights</h2>
      <p>
        If your landlord fails to adhere to the statutory timescales outlined under Awaab's Law, follow this systematic escalation pathway:
      </p>
      <ol class="space-y-3 my-4 list-decimal pl-5">
        <li><strong>Formal Written Notice:</strong> Always communicate in writing (email or recorded post). Explicitly reference <em>Section 42 of the Social Housing Regulation Act 2023 (Awaab's Law)</em> and detail dates of initial notice.</li>
        <li><strong>Environmental Health Inspection:</strong> Contact your local council's Private Sector Housing or Environmental Health team. Under the Housing Health and Safety Rating System (HHSRS), Category 1 damp hazards trigger mandatory Council Improvement Notices.</li>
        <li><strong>Housing Ombudsman Escalation:</strong> For housing associations and council properties, lodge a formal dispute with the Housing Ombudsman Service. The Ombudsman routinely awards compensation ranging from £1,000 to £5,000+ for unreasonable repair delays.</li>
        <li><strong>County Court Action for Breach of Contract:</strong> Awaab's Law terms are implied directly into tenancy contracts. Tenants can sue landlords directly for damages, rent refunds, and court-ordered specific performance injunctions.</li>
      </ol>
    `
  },

  // =========================================================================
  // GUIDE 3: DEHUMIDIFIER SIZING FOR VICTORIAN HOMES
  // =========================================================================
  {
    slug: "dehumidifier-capacity-victorian-terraces",
    title: "Best Dehumidifier Capacity for UK Victorian & Solid Wall Homes",
    metaTitle: "Dehumidifier Capacity Sizing for UK Victorian Terraces (2026)",
    metaDescription: "Calculate the exact dehumidifier capacity needed for Victorian and solid-wall homes. Compressor vs desiccant, extraction litres per day, and running costs.",
    targetKeyword: "dehumidifier capacity victorian terrace",
    category: "Mitigation & Technology",
    datePublished: "2025-02-18T08:00:00Z",
    dateModified: "2026-10-04T08:00:00Z",
    readingTime: "6 min read",
    quickVerdict: {
      riskLevel: "High Vapor Accumulation Zone",
      primaryCause: "Lack of cavity insulation in 9-inch solid brick construction",
      recommendedSolution: "12L-20L compressor unit for heated living areas; Desiccant for cold rooms (<15°C)",
      keyTakeaway: "Do not buy a compact 500ml or 2L peltier dehumidifier for a Victorian house. Pre-1930 solid wall homes require an extraction capacity of at least 12L to 20L per day to maintain relative humidity between 50% and 55% during British winters."
    },
    relatedOutcodes: ["B11", "B21", "M14", "M19"],
    faqItems: [
      {
        question: "Why do small mini-dehumidifiers fail in Victorian houses?",
        answer: "Mini electric Peltier (semiconductor) dehumidifiers extract only 250ml to 500ml per 24 hours. A standard UK household generates 10,000ml to 15,000ml (10-15 litres) of vapor every day. Peltier units cannot cope with this volume and have virtually zero effect on solid-wall dew points."
      },
      {
        question: "Should I buy a compressor or a desiccant dehumidifier?",
        answer: "Choose a compressor dehumidifier (e.g. MeacoDry ABC or Pro Breeze 20L) for heated living rooms and bedrooms kept above 16°C: they consume half the electricity of desiccant units. Choose a desiccant dehumidifier (e.g. EcoAir DD1 Simple) for unheated basements, garages, or cold solid-wall rooms that routinely drop below 15°C, where compressors lose efficiency."
      },
      {
        question: "How much does it cost to run a 20L dehumidifier in the UK?",
        answer: "Under the UK Ofgem energy price cap (~24.5p/kWh), a modern high-efficiency 20L compressor unit draws roughly 219W to 250W. Running on smart humidistat mode (active approx 6 hours a day) costs between 32p and 40p per day, saving significantly more in heating efficiency because dry air requires much less energy to heat than damp air."
      },
      {
        question: "What relative humidity (RH) setting should I select?",
        answer: "Set your digital humidistat between 50% and 55% relative humidity. Setting it above 60% allows mould spores to germinate on cold corners. Setting it below 45% wastes unnecessary electricity and can cause dry skin and woodwork shrinking."
      }
    ],
    contentHtml: `
      <h2>The Challenge of Heating & Dehumidifying Pre-1930 Homes</h2>
      <p>
        Over 5.5 million homes across England and Wales were built prior to 1930 using <strong>solid brick or solid stone masonry</strong> without a cavity gap. In postal districts like Sparkhill (<a href="/damp-risk/b11" class="text-cyan-600 font-bold hover:underline">B11</a>) and Handsworth (<a href="/damp-risk/b21" class="text-cyan-600 font-bold hover:underline">B21</a>), over 60% of homes retain these original solid walls.
      </p>
      <p>
        Unlike modern cavity-wall homes with insulation barriers, solid brick walls conduct winter cold directly into the property. The internal plaster temperature frequently drops to 10°C–12°C. To stop mould in these environments, homeowners must aggressively control indoor relative humidity using correctly sized mechanical dehumidification.
      </p>

      <h2>Dehumidifier Sizing Matrix for UK Properties</h2>
      <div class="overflow-x-auto my-6">
        <table class="w-full border-collapse border border-slate-200 text-sm">
          <thead>
            <tr class="bg-slate-900 text-white">
              <th class="p-3 text-left">Property Size & Type</th>
              <th class="p-3 text-left">Housing Era</th>
              <th class="p-3 text-left text-cyan-400">Recommended Capacity</th>
              <th class="p-3 text-left">Technology Type</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            <tr>
              <td class="p-3 font-semibold">1-2 Bed Flat / Small Terrace</td>
              <td class="p-3">Post-1980 Cavity Wall</td>
              <td class="p-3 font-bold text-cyan-700">10L – 12L / Day</td>
              <td class="p-3">Compressor (Low noise &lt;38 dB)</td>
            </tr>
            <tr>
              <td class="p-3 font-semibold">2-3 Bed Mid-Terrace</td>
              <td class="p-3">Pre-1930 Solid Wall</td>
              <td class="p-3 font-bold text-cyan-700">12L – 16L / Day</td>
              <td class="p-3">Compressor with Humidistat</td>
            </tr>
            <tr>
              <td class="p-3 font-semibold">3-4 Bed Large Semi or End-Terrace</td>
              <td class="p-3">Victorian Solid Brick</td>
              <td class="p-3 font-bold text-rose-700">20L – 25L / Day</td>
              <td class="p-3">Heavy-Duty Compressor + HEPA</td>
            </tr>
            <tr>
              <td class="p-3 font-semibold">Unheated Cellar / Basement / Garage</td>
              <td class="p-3">Any Age (&lt;15°C)</td>
              <td class="p-3 font-bold text-amber-700">7.5L – 10L Desiccant</td>
              <td class="p-3">Rotary Desiccant (No compressor)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Compressor vs Desiccant: Which Technology is Right?</h2>
      <p>
        The operating ambient temperature of your room dictates whether a compressor or desiccant dehumidifier will work:
      </p>
      <ul>
        <li><strong>Compressor Dehumidifiers:</strong> Draw air over an ice-cold refrigerated coil. They are exceptionally energy-efficient at typical UK living temperatures (17°C–21°C), consuming roughly 160W–240W. However, below 15°C, their coils freeze up and require automated defrost cycles, severely curbing extraction rates.</li>
        <li><strong>Desiccant Dehumidifiers:</strong> Use a spinning rotor coated in natural zeolite desiccant chemical that absorbs water directly from cold air without refrigeration. They operate down to 1°C and exhaust warm air (+2°C above room temperature), making them ideal for unheated basements, cellar workshops, or poorly heated bedrooms in older stone buildings.</li>
      </ul>
    `
  },

  // =========================================================================
  // GUIDE 4: PRE-PURCHASE DAMP SURVEY & MORTGAGE RETENTION
  // =========================================================================
  {
    slug: "pre-purchase-damp-survey-mortgage-retention-guide",
    title: "Pre-Purchase Damp Surveys: How to Avoid Mortgage Retentions & Chemical DPC Scams",
    metaTitle: "Pre-Purchase Damp Survey & Mortgage Retentions Guide (2026)",
    metaDescription: "Avoid costly mortgage retention clauses and £4,000 chemical injection scams. How independent PCA damp surveys protect homebuyers and mortgage approvals.",
    targetKeyword: "pre purchase damp survey mortgage retention",
    category: "Surveys & Property",
    datePublished: "2025-02-24T08:00:00Z",
    dateModified: "2026-10-04T08:00:00Z",
    readingTime: "7 min read",
    quickVerdict: {
      riskLevel: "Mortgage Lending Retention Risk",
      primaryCause: "Homebuyer survey highlighting high moisture meter readings",
      recommendedSolution: "Independent CSRT/PCA surveyor inspection with BRE 245 carbide testing",
      keyTakeaway: "Never accept a 'free damp survey' from a remedial contractor with a financial incentive to sell chemical injections. Always commission an independent CSRT surveyor who does not sell building works to produce an unbiased mortgage-grade report."
    },
    relatedOutcodes: ["B21", "B1", "M14", "M1"],
    faqItems: [
      {
        question: "What is a mortgage damp retention?",
        answer: "When a mortgage lender's valuation surveyor finds high moisture readings or signs of timber decay, the lender may hold back a portion of the loan (typically £3,000 to £15,000) until a specialist damp and timber survey is completed and required remedial repairs are signed off."
      },
      {
        question: "Why are 'free damp surveys' dangerous for homebuyers?",
        answer: "Remedial damp-proofing contractors often offer 'free surveys.' However, these contractors make their profit solely by installing chemical damp-proof injections and waterproofing membranes. They have a massive conflict of interest and will almost always find 'rising damp' requiring thousands of pounds in work."
      },
      {
        question: "What qualification should an independent damp surveyor hold?",
        answer: "Your surveyor should hold the CSRT (Certificated Surveyor in Remedial Treatment) or CSTDB (Certificated Surveyor of Timber & Dampness in Buildings) qualification, accredited by the Property Care Association (PCA) or RICS. Ensure they operate on a fixed-fee inspection model without selling remedial chemicals."
      },
      {
        question: "Can I renegotiate the house purchase price based on a damp survey?",
        answer: "Yes. If an independent PCA survey discovers structural penetrating damp, wood-boring beetle (woodworm) infestation, or timber wet rot, you can present the detailed survey report and contractor repair quotes to the seller to negotiate a direct price reduction before exchange of contracts."
      }
    ],
    contentHtml: `
      <h2>The Homebuyer's Nightmare: The Dreaded Mortgage Retention</h2>
      <p>
        You have had an offer accepted on a Victorian terraced home, paid for your RICS Home Survey Level 2 or Level 3, and received the report—only to find an alarming red-rated clause:
      </p>
      <blockquote class="p-4 my-4 bg-slate-100 border-l-4 border-rose-500 text-slate-800 text-xs italic">
        "High moisture readings were detected at the base of ground floor party walls. A £10,000 mortgage retention is applied until a specialist Damp & Timber report is obtained from a PCA-registered contractor."
      </blockquote>
      <p>
        Mortgage retentions can derail property transactions, delay completion dates, and generate severe financial stress. Understanding how lenders evaluate damp risks and knowing how to commission an <strong>independent, unbiased survey</strong> is crucial to protecting your deposit.
      </p>

      <h2>Free Contractor Surveys vs Independent PCA Surveyors</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
        <div class="p-5 rounded-2xl bg-rose-50 border border-rose-200">
          <span class="text-xs font-black uppercase text-rose-700 block">Damp-Proofing Contractor</span>
          <h3 class="text-lg font-bold text-slate-900 mt-1">"Free" Inspection</h3>
          <ul class="text-xs text-slate-600 mt-3 space-y-2">
            <li>❌ Massive commercial conflict of interest</li>
            <li>❌ Relies solely on electronic prong meters (prone to salt false positives)</li>
            <li>❌ Inevitably quotes £3,000–£6,000 for chemical DPC drilling and re-plastering</li>
            <li>❌ Rarely investigates sub-floor ventilation or exterior ground level bridging</li>
          </ul>
        </div>

        <div class="p-5 rounded-2xl bg-emerald-50 border border-emerald-200">
          <span class="text-xs font-black uppercase text-emerald-800 block">Independent PCA Surveyor</span>
          <h3 class="text-lg font-bold text-slate-900 mt-1">Paid Fixed Fee (£250–£450)</h3>
          <ul class="text-xs text-slate-600 mt-3 space-y-2">
            <li>✅ Zero financial interest in selling building works</li>
            <li>✅ Holds CSRT/CSTDB accreditation recognised by all major mortgage lenders</li>
            <li>✅ Tests sub-floor joists for dry rot (*Serpula lacrymans*) and woodworm</li>
            <li>✅ Recommends low-cost root cause fixes (clearing air bricks, fixing gutter leaks)</li>
          </ul>
        </div>
      </div>

      <h2>How to Clear a Mortgage Retention Clause</h2>
      <ol class="space-y-3 my-4 list-decimal pl-5">
        <li><strong>Commission an Independent CSRT Specialist:</strong> Book a surveyor who carries professional indemnity insurance and produces reports formatted to British Standards BS 6576 and BS 5250.</li>
        <li><strong>Request Thermal Imaging & Sub-Floor Inspection:</strong> Ensure the surveyor lifts floorboards where accessible to visually inspect timber wall plates and sleeper walls for fungal decay.</li>
        <li><strong>Submit the Report Directly to Your Mortgage Broker:</strong> If the report demonstrates that high moisture readings are superficial condensation rather than structural damp, the lender will frequently release the retention without requiring any chemical injections.</li>
      </ol>
    `
  }
];

export function getAllGuides(): GuideArticle[] {
  return guidesData;
}

export function getGuideBySlug(slug: string): GuideArticle | undefined {
  if (!slug) return undefined;
  const clean = slug.trim().toLowerCase();
  return guidesData.find((g) => g.slug.toLowerCase() === clean);
}

export function getGuidesByCategory(category: GuideArticle["category"]): GuideArticle[] {
  return guidesData.filter((g) => g.category === category);
}
