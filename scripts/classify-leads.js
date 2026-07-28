// Classifies enriched leads into tiers A/B/C/D using the rule-based engine
// in lib/classify.js. Safe to re-run: leads already classified are skipped
// unless --reclassify is passed, so re-running after Google/Meta checks land
// can upgrade earlier "partial confidence" classifications.
// Usage: node scripts/classify-leads.js [batchSize] [--reclassify]

require("dotenv").config();

const { MongoClient } = require("mongodb");
const { classify } = require("../src/lib/classify");

async function main() {
  const args = process.argv.slice(2);
  const reclassify = args.includes("--reclassify");
  const batchSize = parseInt(args.find((a) => !a.startsWith("--")) || process.env.CLASSIFY_BATCH_SIZE || "50", 10);

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("Missing MONGODB_URI environment variable (check your .env file).");
    process.exit(1);
  }
  const dbName = process.env.MONGODB_DB || "samvid_lead_engine";

  const client = new MongoClient(uri);
  const tally = { A: 0, B: 0, C: 0, D: 0 };
  let processed = 0;
  let skippedNoEnrichment = 0;

  try {
    await client.connect();
    const db = client.db(dbName);
    const leads = db.collection("leads");
    const enrichment = db.collection("enrichment");
    const classification = db.collection("classification");

    const statusFilter = reclassify ? { status: { $in: ["enriched", "classified"] } } : { status: "enriched" };
    const batch = await leads.find(statusFilter).sort({ lead_id: 1 }).limit(batchSize).toArray();

    console.log(`Fetched ${batch.length} lead(s) to classify (batch size ${batchSize}, reclassify=${reclassify})`);

    const leadIds = batch.map((l) => l.lead_id);
    const enrichmentDocs = await enrichment.find({ lead_id: { $in: leadIds } }).toArray();
    const enrichmentByLeadId = new Map(enrichmentDocs.map((d) => [d.lead_id, d]));

    for (const lead of batch) {
      const enrichmentDoc = enrichmentByLeadId.get(lead.lead_id);
      if (!enrichmentDoc) {
        skippedNoEnrichment += 1;
        console.warn(`  lead_id ${lead.lead_id} (${lead.name}): no enrichment doc found, skipping`);
        continue;
      }

      const result = classify(enrichmentDoc);
      await classification.updateOne(
        { lead_id: lead.lead_id },
        { $set: { lead_id: lead.lead_id, ...result, classified_at: new Date() } },
        { upsert: true }
      );
      await leads.updateOne(
        { lead_id: lead.lead_id },
        {
          $set: {
            status: "classified",
            classification_category: result.category,
            classification_confidence: result.confidence,
          },
        }
      );

      tally[result.category] += 1;
      processed += 1;
      console.log(`  lead_id ${lead.lead_id} (${lead.name}): ${result.category} (${result.confidence}) - ${result.reasoning}`);
    }
  } finally {
    await client.close();
  }

  console.log(
    `Done. Processed: ${processed}, skipped (no enrichment): ${skippedNoEnrichment}, tally: A=${tally.A} B=${tally.B} C=${tally.C} D=${tally.D}`
  );
}

main().catch((err) => {
  console.error("Classification run failed:", err);
  process.exit(1);
});
