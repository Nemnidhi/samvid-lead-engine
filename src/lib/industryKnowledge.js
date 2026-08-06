// Industry knowledge bank - one entry per industry. Used to generate
// industry-specific pain-points text, revenue-leak bullets, and an outlook
// line for the report, instead of the single generic DEFAULT_PAIN_POINTS in
// reportConfig.js.
//
// Add a new industry by following the same shape as "textile_apparel".
// Discipline for any numeric or forward-looking claim: always attach a
// source, and hedge speculative claims explicitly (see generateParagraph.js
// for the same "use only the facts provided" discipline applied to the
// per-lead assessment paragraph).
//
// revenueLeaks are real, industry-standard risk categories (e.g. "stockouts
// of high-demand sizes") sourced from industry research, not fabricated
// numbers about a specific lead. Never turn these into a rupee-figure claim
// about a specific business without real data behind it.
//
// Matching is honest about what we actually measure: the Digital Presence
// Audit only checks website/social/SEO, not internal operations, so pain
// points are tagged against those same gap categories ("website", "social")
// rather than pretending to detect operational issues we have no signal for.

const INDUSTRY_KNOWLEDGE = {
  textile_apparel: {
    label: "Textile & Apparel",

    painPoints: [
      {
        issue: "Fragmented production and order visibility",
        tags: ["website", "social"],
        summary:
          "Many businesses in this space still run on spreadsheets, paper job cards, and WhatsApp messages, so management often only learns about a delay or a missed order once it's already at risk.",
        revenueLeaks: [
          "Excess work-in-progress and idle machine or operator time",
          "Unbalanced production lines and hidden rework",
          "Missed buyer delivery windows and unplanned overtime",
        ],
      },
      {
        issue: "Forecasting errors and inventory imbalance",
        tags: ["website"],
        summary:
          "Demand is seasonal and trend-sensitive, and without a system tracking real enquiry and order data, it's easy to over-produce the wrong styles while running short on what's actually selling.",
        revenueLeaks: [
          "Unsold finished goods requiring markdowns",
          "Stockouts of high-demand sizes or styles",
          "Working capital trapped in slow-moving inventory",
        ],
      },
      {
        issue: "Slow collections and buyer concentration",
        tags: ["social"],
        summary:
          "Long buyer credit terms combined with no automated follow-up on receivables creates a cash-flow gap that's easy to lose track of without a dedicated system.",
        revenueLeaks: [
          "Delayed receivables and higher working-capital expense",
          "Unapproved deductions and debit notes going unchallenged",
          "Cash-flow disruption when a major buyer's order slips",
        ],
      },
      {
        issue: "Raw-material price and quality volatility",
        tags: [],
        summary:
          "Input costs can move significantly between quoting and purchasing, which erodes margin unless pricing includes a live-cost mechanism.",
        revenueLeaks: [
          "Orders quoted using outdated material prices",
          "Emergency procurement at premium prices",
          "Production stoppage caused by late supplier delivery",
        ],
      },
      {
        issue: "Shade, measurement and quality inconsistency",
        tags: [],
        summary:
          "Orders can be rejected over shade variation, shrinkage, or measurement defects, which is costly without inline inspection and batch traceability.",
        revenueLeaks: [
          "Re-dyeing, reprocessing, and buyer debit notes",
          "Product returns and marketplace penalties",
          "Entire batches downgraded to lower-value markets",
        ],
      },
    ],

    // Reference data for later use once a business-scale signal exists
    // (e.g. estimated employee count or revenue) - not yet rendered in the
    // report, since there's no way to pick the right row for a given lead.
    financialMatrix: [
      {
        scale: "Startup / Early Stage",
        revenue: "Rs. 25 lakh - Rs. 5 crore",
        margin: "-5% to 8%",
        profile: "Small apparel label, trading business, job-work unit, boutique manufacturer, or early D2C brand",
      },
      {
        scale: "Small Scale",
        revenue: "Rs. 5 crore - Rs. 50 crore",
        margin: "3% to 10%",
        profile: "Local garment manufacturer, fabric processor, regional brand, small exporter, or contract manufacturer",
      },
      {
        scale: "Medium Scale",
        revenue: "Rs. 50 crore - Rs. 500 crore",
        margin: "5% to 12%",
        profile: "Integrated manufacturer, established exporter, multi-state brand, or specialised technical-textile company",
      },
      {
        scale: "Large Scale / Enterprise",
        revenue: "Above Rs. 500 crore",
        margin: "4% to 14%",
        profile: "Vertically integrated textile group, national fashion retailer, major exporter, or technical-textile enterprise",
      },
    ],

    outlook: {
      sentence:
        "India's textile and apparel sector is targeting roughly US$350 billion in industry size by 2030, up from an estimated US$190 billion in FY2025-26 - an industry ambition, not a guaranteed forecast.",
      source: "IBEF",
    },
  },
};

// Fallback revenue-leak bullets for leads whose industry isn't in the
// knowledge bank yet. These are general, structural consequences of having
// no digital presence/CRM - true regardless of sector, not a claim about
// this specific business's numbers.
const GENERIC_REVENUE_LEAKS = [
  "Enquiries that never get logged or followed up simply disappear, with no record anyone lost them",
  "A customer who can't find you online finds a competitor who does show up",
  "No way to tell which leads are worth chasing, so time gets spent on the wrong ones",
];

function getIndustryKnowledge(industryKey) {
  if (!industryKey) return null;
  return INDUSTRY_KNOWLEDGE[industryKey] || null;
}

// Picks the 1-2 pain points most relevant to what this lead is actually
// missing (matched against the same gap categories used in the Digital
// Presence Audit), and returns a short paragraph - not the full
// knowledge-bank entry. Falls back to the first two pain points if nothing
// tagged matches, so the section is never empty for a known industry.
function getMatchedPainPoints(industryKey, missingTags) {
  const industry = getIndustryKnowledge(industryKey);
  if (!industry) return [];

  const tagSet = new Set(missingTags || []);
  const matched = industry.painPoints.filter((p) => p.tags.some((t) => tagSet.has(t)));
  return (matched.length > 0 ? matched : industry.painPoints).slice(0, 2);
}

function getIndustryPainPointsText(industryKey, missingTags) {
  const chosen = getMatchedPainPoints(industryKey, missingTags);
  if (chosen.length === 0) return null;
  return chosen.map((p) => p.summary).join(" ");
}

// Returns up to 4 revenue-leak bullets: from the matched industry pain
// points if the industry is known, otherwise the generic fallback list.
// Always real, sourced-in-kind risk categories - never a fabricated number.
function getRevenueLeaks(industryKey, missingTags) {
  const chosen = getMatchedPainPoints(industryKey, missingTags);
  if (chosen.length === 0) return GENERIC_REVENUE_LEAKS;

  const leaks = chosen.flatMap((p) => p.revenueLeaks || []);
  return leaks.length > 0 ? leaks.slice(0, 4) : GENERIC_REVENUE_LEAKS;
}

function getIndustryOutlookLine(industryKey) {
  const industry = getIndustryKnowledge(industryKey);
  if (!industry || !industry.outlook) return null;
  return `${industry.outlook.sentence} (Source: ${industry.outlook.source})`;
}

module.exports = {
  INDUSTRY_KNOWLEDGE,
  GENERIC_REVENUE_LEAKS,
  getIndustryKnowledge,
  getIndustryPainPointsText,
  getRevenueLeaks,
  getIndustryOutlookLine,
};
