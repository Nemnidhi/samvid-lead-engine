// Report PDF template, built with @react-pdf/renderer. Written with
// React.createElement (no JSX) since scripts/ runs as plain CommonJS with no
// transpiler - see scripts/generate-report.js for the runner.

const React = require("react");
const { Document, Page, View, Text, StyleSheet } = require("@react-pdf/renderer");

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
    fontSize: 11,
    fontFamily: "Helvetica",
    color: "#18181b",
  },
  header: {
    marginBottom: 20,
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
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 9,
    color: "#a1a1aa",
    borderTop: "1 solid #e4e4e7",
    paddingTop: 8,
  },
});

function statusLabel(channel) {
  if (channel.checked === false) return "Not yet checked";
  return channel.found ? "Found" : "Not found";
}

function buildReportDocument({ lead, enrichment, classification, paragraph }) {
  const rows = [
    { label: "Website", value: statusLabel({ checked: true, found: enrichment.website?.found }) },
  ];
  if (enrichment.google_business) {
    rows.push({ label: "Google Business profile", value: statusLabel(enrichment.google_business) });
  }
  if (enrichment.meta_ads) {
    rows.push({ label: "Meta ad activity", value: statusLabel(enrichment.meta_ads) });
  }

  return React.createElement(
    Document,
    { title: `${lead.name} - Digital Presence Report` },
    React.createElement(
      Page,
      { size: "A4", style: styles.page },
      React.createElement(
        View,
        { style: styles.header },
        React.createElement(Text, { style: styles.brand }, "SAMVID LEAD ENGINE"),
        React.createElement(Text, { style: styles.businessName }, lead.name),
        React.createElement(
          Text,
          { style: styles.location },
          [lead.district, lead.state].filter(Boolean).join(", ")
        )
      ),
      React.createElement(
        View,
        { style: styles.section },
        React.createElement(Text, { style: styles.sectionTitle }, "Digital Presence Summary"),
        ...rows.map((row, i) =>
          React.createElement(
            View,
            { style: styles.row, key: i },
            React.createElement(Text, { style: styles.rowLabel }, row.label),
            React.createElement(Text, { style: styles.rowValue }, row.value)
          )
        )
      ),
      React.createElement(
        View,
        { style: styles.section },
        React.createElement(Text, { style: styles.sectionTitle }, "Assessment"),
        React.createElement(
          Text,
          { style: [styles.badge, { backgroundColor: TIER_COLOR[classification.category] }] },
          `Tier ${classification.category}: ${TIER_LABEL[classification.category]}`
        ),
        React.createElement(Text, { style: styles.paragraph }, paragraph)
      ),
      React.createElement(
        Text,
        { style: styles.footer },
        `Prepared by Samvid Lead Engine. Based on publicly available information checked at time of generation.`
      )
    )
  );
}

module.exports = { buildReportDocument };
