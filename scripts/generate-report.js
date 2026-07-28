// Generates one report PDF for a single lead, for local testing.
// Usage: node scripts/generate-report.js <lead_id>
// Writes to data/reports/<lead_id>.pdf (gitignored - contains real business data).

require("dotenv").config();

const path = require("path");
const fs = require("fs");
const { MongoClient } = require("mongodb");
const { renderToFile } = require("@react-pdf/renderer");
const { buildReportDocument } = require("./lib/reportTemplate");
const { generateParagraph } = require("./lib/generateParagraph");

async function main() {
  const leadId = parseInt(process.argv[2], 10);
  if (!leadId) {
    console.error("Usage: node scripts/generate-report.js <lead_id>");
    process.exit(1);
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("Missing MONGODB_URI environment variable (check your .env file).");
    process.exit(1);
  }
  const dbName = process.env.MONGODB_DB || "samvid_lead_engine";

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);

    const lead = await db.collection("leads").findOne({ lead_id: leadId });
    const enrichment = await db.collection("enrichment").findOne({ lead_id: leadId });
    const classification = await db.collection("classification").findOne({ lead_id: leadId });

    if (!lead || !enrichment || !classification) {
      console.error(
        `Missing data for lead_id ${leadId}: lead=${!!lead} enrichment=${!!enrichment} classification=${!!classification}`
      );
      process.exit(1);
    }

    console.log(`Generating paragraph for ${lead.name}...`);
    const paragraphResult = await generateParagraph(lead, enrichment, classification);
    console.log(`  source: ${paragraphResult.source}`);
    if (paragraphResult.source !== "groq") {
      console.log(`  groq error: ${paragraphResult.groqError}`);
    }
    console.log(`  text: ${paragraphResult.text}`);

    const doc = buildReportDocument({
      lead,
      enrichment,
      classification,
      paragraph: paragraphResult.text,
    });

    const outDir = path.join(__dirname, "..", "data", "reports");
    fs.mkdirSync(outDir, { recursive: true });
    const outPath = path.join(outDir, `${leadId}.pdf`);

    await renderToFile(doc, outPath);
    console.log(`Wrote ${outPath}`);
  } finally {
    await client.close();
  }
}

main().catch((err) => {
  console.error("Report generation failed:", err);
  process.exit(1);
});
