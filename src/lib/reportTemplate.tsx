// Report PDF template for the Next.js app (API routes). Mirrors
// scripts/lib/reportTemplate.js, which the standalone CLI script uses -
// kept as a separate file because @react-pdf/renderer is ESM-only and a
// plain CommonJS require() of it fails Next's webpack bundling, while a
// real `import` in a .tsx file works natively.

import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";

const TIER_LABEL: Record<string, string> = {
  A: "No digital presence found",
  B: "Minimal digital presence",
  C: "Partial digital presence",
  D: "Strong digital presence",
};

const TIER_COLOR: Record<string, string> = {
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

type Channel = { checked?: boolean; found?: boolean };

function statusLabel(channel: Channel) {
  if (channel.checked === false) return "Not yet checked";
  return channel.found ? "Found" : "Not found";
}

export type ReportInput = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  lead: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  enrichment: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  classification: any;
  paragraph: string;
};

export function buildReportDocument({ lead, enrichment, classification, paragraph }: ReportInput) {
  const rows: { label: string; value: string }[] = [
    { label: "Website", value: statusLabel({ checked: true, found: enrichment.website?.found }) },
  ];
  if (enrichment.google_business) {
    rows.push({ label: "Google Business profile", value: statusLabel(enrichment.google_business) });
  }
  if (enrichment.meta_ads) {
    rows.push({ label: "Meta ad activity", value: statusLabel(enrichment.meta_ads) });
  }

  return (
    <Document title={`${lead.name} - Digital Presence Report`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.brand}>SAMVID LEAD ENGINE</Text>
          <Text style={styles.businessName}>{lead.name}</Text>
          <Text style={styles.location}>{[lead.district, lead.state].filter(Boolean).join(", ")}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Digital Presence Summary</Text>
          {rows.map((row, i) => (
            <View style={styles.row} key={i}>
              <Text style={styles.rowLabel}>{row.label}</Text>
              <Text style={styles.rowValue}>{row.value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Assessment</Text>
          <Text style={[styles.badge, { backgroundColor: TIER_COLOR[classification.category] }]}>
            {`Tier ${classification.category}: ${TIER_LABEL[classification.category]}`}
          </Text>
          <Text style={styles.paragraph}>{paragraph}</Text>
        </View>

        <Text style={styles.footer}>
          Prepared by Samvid Lead Engine. Based on publicly available information checked at time of
          generation.
        </Text>
      </Page>
    </Document>
  );
}
