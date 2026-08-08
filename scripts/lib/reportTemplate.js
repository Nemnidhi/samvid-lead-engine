// Report PDF template, built with @react-pdf/renderer. Written with
// React.createElement (no JSX) since scripts/ runs as plain CommonJS with no
// transpiler - see scripts/generate-report.js for the runner. Mirrors
// src/lib/reportTemplate.tsx (real JSX, used by Next API routes) - keep
// both in sync if the template changes. Company details and pricing live in
// src/lib/reportConfig.js (single shared file, edit values there).

const React = require("react");
const { Document, Page, View, Text, Image, Link, StyleSheet } = require("@react-pdf/renderer");
const QRCode = require("qrcode");
const {
  COMPANY,
  WHO_WE_ARE,
  PRIVACY_NOTE,
  SOLUTION_MAP,
  IMPACT_MAP,
  PACKAGES_NOTE,
  DEFAULT_PAIN_POINTS,
  AUTOMATION_FLOW,
  PRICING_TIERS,
  CUSTOM_TIER,
  CLOSING_CTA,
  RESPONSE_TIME_NOTE,
  WHATSAPP_LINK,
  NEXT_STEPS,
} = require("../../src/lib/reportConfig");
const {
  getIndustryKnowledge,
  getIndustryPainPointsText,
  getRevenueLeaks,
  getIndustryOutlookLine,
  getCurrentFlowStages,
} = require("../../src/lib/industryKnowledge");

// Maps Digital Presence Audit row labels to the gap category used to match
// industry knowledge-bank pain points - kept small and honest: we only tag
// against gaps we actually measure, not operational issues we have no
// signal for.
const ROW_TO_GAP_TAG = {
  Website: "website",
  "Technical SEO": "website",
  "Google Business profile": "website",
  "Meta ad activity": "social",
};

const TIER_LABEL = {
  A: "No digital presence found",
  B: "Minimal digital presence",
  C: "Partial digital presence",
  D: "Strong digital presence",
};

const TIER_COLOR = {
  A: "#b91c1c",
  B: "#c2410c",
  C: "#a16207",
  D: "#15803d",
};

const styles = StyleSheet.create({
  page: {
    padding: 40,
    paddingBottom: 56,
    fontSize: 11,
    fontFamily: "Helvetica",
    color: "#18181b",
  },
  header: {
    marginBottom: 16,
    borderBottom: "2 solid #18181b",
    paddingBottom: 12,
  },
  brand: {
    fontSize: 10,
    color: "#71717a",
    marginBottom: 4,
  },
  businessName: {
    fontSize: 20,
    fontWeight: 700,
  },
  location: {
    fontSize: 11,
    color: "#52525b",
    marginTop: 2,
  },
  hook: {
    fontSize: 13,
    fontWeight: 700,
    color: "#b91c1c",
    marginTop: 10,
  },
  leakIntro: {
    fontSize: 10.5,
    color: "#3f3f46",
    marginTop: 8,
    marginBottom: 6,
  },
  leakRow: {
    flexDirection: "row",
    paddingVertical: 3,
  },
  leakBullet: {
    width: 12,
    fontSize: 10,
    color: "#b91c1c",
    fontWeight: 700,
  },
  leakText: {
    flex: 1,
    fontSize: 10,
    color: "#27272a",
  },
  solutionImpact: {
    fontSize: 9,
    color: "#71717a",
    marginTop: -3,
    marginBottom: 7,
  },
  companyBox: {
    marginBottom: 18,
    padding: 10,
    borderRadius: 4,
    backgroundColor: "#f4f4f5",
  },
  companyText: {
    fontSize: 9.5,
    lineHeight: 1.5,
    color: "#3f3f46",
  },
  companyMeta: {
    fontSize: 8.5,
    color: "#71717a",
    marginTop: 6,
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 8,
    textTransform: "uppercase",
    color: "#3f3f46",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottom: "1 solid #e4e4e7",
  },
  rowLabel: {
    fontSize: 11,
  },
  rowValue: {
    fontSize: 11,
    fontWeight: 700,
  },
  badge: {
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    color: "#ffffff",
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 6,
  },
  paragraph: {
    fontSize: 11,
    lineHeight: 1.5,
    color: "#27272a",
  },
  industryOutlook: {
    fontSize: 9,
    lineHeight: 1.4,
    color: "#71717a",
    fontStyle: "italic",
    marginTop: 6,
  },
  screenshot: {
    marginTop: 6,
    maxWidth: 240,
    border: "1 solid #e4e4e7",
  },
  competitorRow: {
    paddingVertical: 4,
    fontSize: 10,
    color: "#27272a",
  },
  testimonialBox: {
    marginBottom: 8,
    padding: 10,
    borderRadius: 4,
    backgroundColor: "#f4f4f5",
  },
  testimonialQuote: {
    fontSize: 10,
    fontStyle: "italic",
    lineHeight: 1.4,
    color: "#27272a",
  },
  testimonialAuthor: {
    fontSize: 8.5,
    color: "#71717a",
    marginTop: 4,
  },
  packagesNote: {
    fontSize: 9.5,
    color: "#52525b",
    marginBottom: 8,
  },
  solutionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottom: "1 solid #e4e4e7",
  },
  solutionGap: {
    fontSize: 10.5,
    color: "#b91c1c",
    flex: 1,
  },
  solutionArrow: {
    fontSize: 10.5,
    color: "#a1a1aa",
    marginHorizontal: 6,
  },
  solutionFix: {
    fontSize: 10.5,
    fontWeight: 700,
    color: "#15803d",
    flex: 1,
    textAlign: "right",
  },
  flowRowWrap: {
    marginBottom: 8,
  },
  flowBranchLabel: {
    fontSize: 8.5,
    fontStyle: "italic",
    color: "#71717a",
    marginBottom: 4,
  },
  flowSubheading: {
    fontSize: 9.5,
    fontWeight: 700,
    color: "#27272a",
    marginBottom: 4,
    marginTop: 2,
  },
  todayIntro: {
    fontSize: 9,
    color: "#52525b",
    marginBottom: 6,
  },
  todayWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  todayPill: {
    flexDirection: "row",
    alignItems: "center",
    border: "1 solid #d4d4d8",
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 6,
    marginRight: 6,
    marginBottom: 6,
    backgroundColor: "#f4f4f5",
  },
  todayPillNumber: {
    fontSize: 8,
    fontWeight: 700,
    color: "#71717a",
    marginRight: 4,
  },
  todayPillText: {
    fontSize: 8,
    color: "#3f3f46",
  },
  flowChain: {
    flexDirection: "row",
    alignItems: "center",
  },
  flowBox: {
    minWidth: 110,
    maxWidth: 140,
    padding: 6,
    borderRadius: 5,
    border: "1 solid #d4d4d8",
  },
  flowBoxEntry: {
    backgroundColor: "#eef2ff",
    borderColor: "#6366f1",
  },
  flowBoxInterested: {
    backgroundColor: "#f0fdf4",
    borderColor: "#22c55e",
  },
  flowBoxNoReply: {
    backgroundColor: "#fffbeb",
    borderColor: "#d97706",
  },
  flowBoxTitle: {
    fontSize: 8.5,
    fontWeight: 700,
    textAlign: "center",
    color: "#27272a",
  },
  flowBoxSubtitle: {
    fontSize: 7,
    textAlign: "center",
    color: "#71717a",
    marginTop: 2,
  },
  flowArrow: {
    fontSize: 12,
    color: "#a1a1aa",
    marginHorizontal: 4,
  },
  priceTable: {
    marginTop: 4,
  },
  priceHeaderRow: {
    flexDirection: "row",
    borderBottom: "1 solid #3f3f46",
    paddingBottom: 4,
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: "row",
    paddingVertical: 6,
    borderBottom: "1 solid #e4e4e7",
  },
  priceColName: { flex: 1, fontSize: 10 },
  priceColOneTime: { flex: 1.1, fontSize: 10 },
  priceColMonthly: { flex: 1.1, fontSize: 10 },
  priceColIncludes: { flex: 2, fontSize: 9, color: "#52525b" },
  priceHeaderText: { fontSize: 9, fontWeight: 700, color: "#3f3f46", textTransform: "uppercase" },
  priceNameText: { fontSize: 10, fontWeight: 700 },
  customTierBox: {
    marginTop: 10,
    padding: 10,
    borderRadius: 4,
    border: "1 solid #d4d4d8",
    backgroundColor: "#fafafa",
  },
  customTierTitle: {
    fontSize: 10,
    fontWeight: 700,
    marginBottom: 4,
  },
  customTierLine: {
    fontSize: 9.5,
    color: "#3f3f46",
    marginTop: 2,
  },
  nextStepRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  nextStepNumber: {
    width: 16,
    fontSize: 10,
    fontWeight: 700,
    color: "#4f46e5",
  },
  nextStepText: {
    flex: 1,
    fontSize: 10,
    color: "#27272a",
  },
  ctaBox: {
    marginTop: 4,
    padding: 12,
    borderRadius: 4,
    backgroundColor: "#eef2ff",
    flexDirection: "row",
    alignItems: "center",
  },
  ctaTextCol: {
    flex: 1,
    paddingRight: 12,
  },
  ctaText: {
    fontSize: 11,
    lineHeight: 1.5,
    color: "#312e81",
    fontWeight: 700,
  },
  ctaResponseTime: {
    fontSize: 9,
    color: "#4338ca",
    marginTop: 6,
    fontWeight: 400,
  },
  ctaQr: {
    width: 64,
    height: 64,
  },
  ctaQrCaption: {
    fontSize: 7,
    color: "#4338ca",
    textAlign: "center",
    marginTop: 3,
    width: 64,
  },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 40,
    right: 40,
    fontSize: 8,
    color: "#a1a1aa",
    borderTop: "1 solid #e4e4e7",
    paddingTop: 6,
  },
});

function statusLabel(channel) {
  if (channel.checked === false) return "Not yet checked";
  return channel.found ? "Found" : "Not found";
}

function flowBox(title, subtitle, variantStyle) {
  const children = [React.createElement(Text, { style: styles.flowBoxTitle, key: "t" }, title)];
  if (subtitle) {
    children.push(React.createElement(Text, { style: styles.flowBoxSubtitle, key: "s" }, subtitle));
  }
  return React.createElement(View, { style: [styles.flowBox, variantStyle] }, ...children);
}

function flowChain(steps, variantStyle) {
  return React.createElement(
    View,
    { style: styles.flowChain },
    ...steps.map((step, i) =>
      React.createElement(
        View,
        { style: { flexDirection: "row", alignItems: "center" }, key: i },
        i > 0 ? React.createElement(Text, { style: styles.flowArrow, key: "arrow" }, "->") : null,
        flowBox(step[0], step[1], variantStyle)
      )
    )
  );
}

function todayFlow(stages) {
  return React.createElement(
    View,
    { style: styles.todayWrap },
    ...stages.map((stage, i) =>
      React.createElement(
        View,
        { style: styles.todayPill, key: i },
        React.createElement(Text, { style: styles.todayPillNumber }, `${i + 1}.`),
        React.createElement(Text, { style: styles.todayPillText }, stage)
      )
    )
  );
}

async function buildReportDocument({
  lead,
  enrichment,
  classification,
  paragraph,
  searchScreenshotUrl,
  competitors = [],
  testimonials = [],
}) {
  const whatsappQrDataUrl = await QRCode.toDataURL(WHATSAPP_LINK, { margin: 1, width: 128 });

  const rows = [
    { label: "Website", value: statusLabel({ checked: true, found: enrichment.website?.found }) },
    // Technical SEO checker isn't built yet (see HANDOFF) - always shown as
    // "Not yet checked" rather than silently omitted, so the offering is
    // visible in every report even before the enrichment step exists.
    { label: "Technical SEO", value: statusLabel({ checked: false }) },
  ];
  if (enrichment.google_business) {
    rows.push({ label: "Google Business profile", value: statusLabel(enrichment.google_business) });
  }
  if (enrichment.meta_ads) {
    rows.push({ label: "Meta ad activity", value: statusLabel(enrichment.meta_ads) });
  }

  const gapRows = rows.filter((r) => r.value === "Not found" && SOLUTION_MAP[r.label]);
  const missingTags = rows
    .filter((r) => r.value === "Not found")
    .map((r) => ROW_TO_GAP_TAG[r.label])
    .filter(Boolean);
  const industryPainPoints = getIndustryPainPointsText(lead.industry, missingTags);
  const industryOutlook = getIndustryOutlookLine(lead.industry);
  const revenueLeaks = getRevenueLeaks(lead.industry, missingTags);
  const industryEntry = getIndustryKnowledge(lead.industry);
  const todayFlowStages = getCurrentFlowStages(lead.industry);
  const todayIntro = industryEntry
    ? `How a ${industryEntry.label.toLowerCase()} business like this typically runs today:`
    : "How a business like this typically runs today:";
  const missingCount = rows.filter((r) => r.value === "Not found").length;
  const hookText =
    missingCount > 0
      ? `${missingCount} of ${rows.length} channels we checked show no active presence.`
      : "Your core digital presence is solid - the real opportunity is in what happens after someone finds you.";
  const generatedOn = new Date().toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const sections = [];

  sections.push(
    React.createElement(
      View,
      { style: styles.header, key: "header" },
      React.createElement(Text, { style: styles.brand }, COMPANY.product.toUpperCase()),
      React.createElement(Text, { style: styles.businessName }, lead.name),
      React.createElement(
        Text,
        { style: styles.location },
        [lead.district, lead.state].filter(Boolean).join(", ")
      ),
      React.createElement(Text, { style: styles.hook }, hookText)
    )
  );

  sections.push(
    React.createElement(
      View,
      { style: styles.companyBox, key: "company" },
      React.createElement(Text, { style: styles.companyText }, WHO_WE_ARE),
      React.createElement(
        Text,
        { style: styles.companyMeta },
        `${COMPANY.legalName} · GST ${COMPANY.gst} · ${COMPANY.address}`
      ),
      React.createElement(Text, { style: styles.companyMeta }, `${COMPANY.phone} · ${COMPANY.email}`)
    )
  );

  sections.push(
    React.createElement(
      View,
      { style: styles.section, key: "audit" },
      React.createElement(Text, { style: styles.sectionTitle }, "Digital Presence Summary"),
      ...rows.map((row, i) =>
        React.createElement(
          View,
          { style: styles.row, key: i },
          React.createElement(Text, { style: styles.rowLabel }, row.label),
          React.createElement(Text, { style: styles.rowValue }, row.value)
        )
      )
    )
  );

  if (searchScreenshotUrl) {
    sections.push(
      React.createElement(
        View,
        { style: styles.section, key: "screenshot" },
        React.createElement(Text, { style: styles.sectionTitle }, "What Customers See"),
        React.createElement(Text, { style: styles.paragraph }, `Search result for "${lead.name}":`),
        React.createElement(Image, { src: searchScreenshotUrl, style: styles.screenshot })
      )
    );
  }

  if (competitors.length > 0) {
    sections.push(
      React.createElement(
        View,
        { style: styles.section, key: "competitors" },
        React.createElement(Text, { style: styles.sectionTitle }, "How You Compare Nearby"),
        ...competitors.map((c, i) =>
          React.createElement(
            Text,
            { style: styles.competitorRow, key: i },
            `${c.name}: ${c.channelsFound.length > 0 ? c.channelsFound.join(", ") : "no presence found"}`
          )
        )
      )
    );
  }

  sections.push(
    React.createElement(
      View,
      { style: styles.section, key: "assessment" },
      React.createElement(Text, { style: styles.sectionTitle }, "Assessment"),
      React.createElement(
        Text,
        { style: [styles.badge, { backgroundColor: TIER_COLOR[classification.category] }] },
        `Tier ${classification.category}: ${TIER_LABEL[classification.category]}`
      ),
      React.createElement(Text, { style: styles.paragraph }, paragraph),
      industryOutlook ? React.createElement(Text, { style: styles.industryOutlook }, industryOutlook) : null
    )
  );

  sections.push(
    React.createElement(
      View,
      { style: styles.section, key: "pain-points" },
      React.createElement(Text, { style: styles.sectionTitle }, "How This Plays Out Today"),
      React.createElement(
        Text,
        { style: styles.paragraph },
        lead.pain_points || industryPainPoints || DEFAULT_PAIN_POINTS
      ),
      React.createElement(
        Text,
        { style: styles.leakIntro },
        "Common revenue leaks for businesses in this position, not specific to any one company:"
      ),
      ...revenueLeaks.map((leak, i) =>
        React.createElement(
          View,
          { style: styles.leakRow, key: i },
          React.createElement(Text, { style: styles.leakBullet }, "-"),
          React.createElement(Text, { style: styles.leakText }, leak)
        )
      )
    )
  );

  if (gapRows.length > 0) {
    sections.push(
      React.createElement(
        View,
        { style: styles.section, key: "solution-map" },
        React.createElement(Text, { style: styles.sectionTitle }, "What Fixes What"),
        ...gapRows.map((row, i) => {
          const fix = SOLUTION_MAP[row.label];
          const impact = IMPACT_MAP[fix];
          return React.createElement(
            View,
            { key: i },
            React.createElement(
              View,
              { style: styles.solutionRow },
              React.createElement(Text, { style: styles.solutionGap }, `${row.label}: missing`),
              React.createElement(Text, { style: styles.solutionArrow }, "->"),
              React.createElement(Text, { style: styles.solutionFix }, fix)
            ),
            impact ? React.createElement(Text, { style: styles.solutionImpact }, impact) : null
          );
        })
      )
    );
  }

  sections.push(
    React.createElement(
      View,
      { style: styles.section, key: "flow" },
      React.createElement(Text, { style: styles.sectionTitle }, "What It Looks Like Solved"),
      React.createElement(Text, { style: styles.flowSubheading }, "Today"),
      React.createElement(Text, { style: styles.todayIntro }, todayIntro),
      todayFlow(todayFlowStages),
      React.createElement(Text, { style: styles.flowSubheading }, "Where Automation Plugs In"),
      React.createElement(
        View,
        { style: styles.flowRowWrap },
        flowChain(AUTOMATION_FLOW.entryChain, styles.flowBoxEntry)
      ),
      React.createElement(
        View,
        { style: styles.flowRowWrap },
        React.createElement(Text, { style: styles.flowBranchLabel }, AUTOMATION_FLOW.interested.label),
        flowChain(AUTOMATION_FLOW.interested.steps, styles.flowBoxInterested)
      ),
      React.createElement(
        View,
        { style: styles.flowRowWrap },
        React.createElement(Text, { style: styles.flowBranchLabel }, AUTOMATION_FLOW.noReply.label),
        flowChain(AUTOMATION_FLOW.noReply.steps, styles.flowBoxNoReply)
      )
    )
  );

  sections.push(
    React.createElement(
      View,
      { style: styles.section, key: "privacy" },
      React.createElement(Text, { style: styles.sectionTitle }, "Data & Privacy"),
      React.createElement(Text, { style: styles.paragraph }, `${PRIVACY_NOTE} Report generated on ${generatedOn}.`)
    )
  );

  if (testimonials.length > 0) {
    sections.push(
      React.createElement(
        View,
        { style: styles.section, key: "testimonials" },
        React.createElement(Text, { style: styles.sectionTitle }, "What Clients Say"),
        ...testimonials.map((t, i) =>
          React.createElement(
            View,
            { style: styles.testimonialBox, key: i },
            React.createElement(Text, { style: styles.testimonialQuote }, `"${t.quote}"`),
            React.createElement(
              Text,
              { style: styles.testimonialAuthor },
              `${t.author}${t.business ? `, ${t.business}` : ""}`
            )
          )
        )
      )
    );
  }

  sections.push(
    React.createElement(
      View,
      { style: styles.section, key: "pricing" },
      React.createElement(Text, { style: styles.sectionTitle }, "Packages"),
      React.createElement(Text, { style: styles.packagesNote }, PACKAGES_NOTE),
      React.createElement(
        View,
        { style: styles.priceTable },
        React.createElement(
          View,
          { style: styles.priceHeaderRow },
          React.createElement(Text, { style: [styles.priceHeaderText, { flex: 1 }] }, "Tier"),
          React.createElement(Text, { style: [styles.priceHeaderText, { flex: 1.1 }] }, "One-time"),
          React.createElement(Text, { style: [styles.priceHeaderText, { flex: 1.1 }] }, "Monthly"),
          React.createElement(Text, { style: [styles.priceHeaderText, { flex: 2 }] }, "Includes")
        ),
        ...PRICING_TIERS.map((tier, i) =>
          React.createElement(
            View,
            { style: styles.priceRow, key: i },
            React.createElement(Text, { style: [styles.priceColName, styles.priceNameText] }, tier.name),
            React.createElement(Text, { style: styles.priceColOneTime }, tier.oneTime),
            React.createElement(Text, { style: styles.priceColMonthly }, tier.monthly),
            React.createElement(Text, { style: styles.priceColIncludes }, tier.includes)
          )
        )
      ),
      React.createElement(
        View,
        { style: styles.customTierBox },
        React.createElement(Text, { style: styles.customTierTitle }, CUSTOM_TIER.name),
        React.createElement(Text, { style: styles.customTierLine }, `One-time: ${CUSTOM_TIER.oneTime}`),
        React.createElement(Text, { style: styles.customTierLine }, `Ongoing: ${CUSTOM_TIER.ongoing}`),
        React.createElement(Text, { style: styles.customTierLine }, CUSTOM_TIER.includes)
      )
    )
  );

  sections.push(
    React.createElement(
      View,
      { style: styles.section, key: "next-steps" },
      React.createElement(Text, { style: styles.sectionTitle }, "What Happens Next"),
      ...NEXT_STEPS.map((step, i) =>
        React.createElement(
          View,
          { style: styles.nextStepRow, key: i },
          React.createElement(Text, { style: styles.nextStepNumber }, `${i + 1}.`),
          React.createElement(Text, { style: styles.nextStepText }, step)
        )
      )
    )
  );

  sections.push(
    React.createElement(
      View,
      { style: styles.section, key: "cta" },
      React.createElement(
        View,
        { style: styles.ctaBox },
        React.createElement(
          View,
          { style: styles.ctaTextCol },
          React.createElement(Text, { style: styles.ctaText }, CLOSING_CTA),
          React.createElement(Text, { style: styles.ctaResponseTime }, RESPONSE_TIME_NOTE)
        ),
        React.createElement(
          View,
          null,
          React.createElement(Image, { src: whatsappQrDataUrl, style: styles.ctaQr }),
          React.createElement(Link, { src: WHATSAPP_LINK, style: styles.ctaQrCaption }, "Scan or tap to chat")
        )
      )
    )
  );

  sections.push(
    React.createElement(
      Text,
      { style: styles.footer, fixed: true, key: "footer" },
      `${COMPANY.legalName} · GST ${COMPANY.gst} · ${COMPANY.email} · Based on publicly available information.`
    )
  );

  return React.createElement(
    Document,
    { title: `${lead.name} - Digital Presence Report` },
    React.createElement(Page, { size: "A4", style: styles.page, wrap: true }, ...sections)
  );
}

module.exports = { buildReportDocument };
