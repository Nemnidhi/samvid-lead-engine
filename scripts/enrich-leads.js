// Enrichment worker: pulls the next batch of un-enriched leads, checks their
// digital presence, and writes results to the `enrichment` collection.
// Designed to run as a scheduled GitHub Action (see .github/workflows), not a
// Vercel function - it loops over many leads and could exceed serverless
// timeouts.
// Usage: node scripts/enrich-leads.js [batchSize]
//        node scripts/enrich-leads.js [batchSize] --regoogle
//          Re-runs ONLY the Google Business check for leads whose
//          enrichment.google_business.checked is still false (e.g. leads
//          enriched back when GOOGLE_PLACES_API_KEY wasn't configured yet).
//          Leaves website/meta_ads and lead status untouched - follow up
//          with `classify-leads -- <n> --reclassify` afterward.

require("dotenv").config();

const { MongoClient } = require("mongodb");
const { checkWebsite } = require("./lib/checkWebsite");
const { checkGoogleBusiness } = require("./lib/checkGoogleBusiness");
const { checkMetaAds } = require("./lib/checkMetaAds");

async function enrichOne(lead) {
  const [website, googleBusiness, metaAds] = await Promise.all([
    checkWebsite(lead.name).catch((err) => ({
      found: false,
      url: null,
      checked_at: new Date(),
      error: String(err),
    })),
    checkGoogleBusiness(lead.name, lead.district, lead.state).catch((err) => ({
      checked: false,
      found: null,
      checked_at: new Date(),
      error: String(err),
    })),
    checkMetaAds(lead.name).catch((err) => ({
      checked: false,
      found: null,
      checked_at: new Date(),
      error: String(err),
    })),
  ]);

  return { website, google_business: googleBusiness, meta_ads: metaAds };
}

async function main() {
  const regoogle = process.argv.includes("--regoogle");
  const batchSize = parseInt(process.argv[2] || process.env.ENRICHMENT_BATCH_SIZE || "10", 10);

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("Missing MONGODB_URI environment variable (check your .env file).");
    process.exit(1);
  }
  const dbName = process.env.MONGODB_DB || "samvid_lead_engine";

  const client = new MongoClient(uri);
  let processed = 0;
  let failed = 0;
  const websiteFoundCount = { yes: 0, no: 0 };
  const googleFoundCount = { yes: 0, no: 0 };

  try {
    await client.connect();
    const db = client.db(dbName);
    const leads = db.collection("leads");
    const enrichment = db.collection("enrichment");

    if (regoogle) {
      const staleIds = (
        await enrichment.find({ "google_business.checked": false }).project({ lead_id: 1 }).limit(batchSize).toArray()
      ).map((e) => e.lead_id);
      const batch = await leads.find({ lead_id: { $in: staleIds } }).toArray();

      console.log(`Re-checking Google Business for ${batch.length} lead(s) (batch size ${batchSize})`);

      for (const lead of batch) {
        try {
          const googleBusiness = await checkGoogleBusiness(lead.name, lead.district, lead.state).catch((err) => ({
            checked: false,
            found: null,
            checked_at: new Date(),
            error: String(err),
          }));
          await enrichment.updateOne({ lead_id: lead.lead_id }, { $set: { google_business: googleBusiness } });
          processed += 1;
          if (googleBusiness.checked) googleFoundCount[googleBusiness.found ? "yes" : "no"] += 1;
          console.log(
            `  lead_id ${lead.lead_id} (${lead.name}): google_business=${
              googleBusiness.checked ? (googleBusiness.found ? "found" : "not found") : "still not checked"
            }`
          );
        } catch (err) {
          failed += 1;
          console.error(`  lead_id ${lead.lead_id} (${lead.name}) failed:`, err);
        }
      }

      console.log(
        `Done. Processed: ${processed}, failed: ${failed}, google business found: ${googleFoundCount.yes}, not found: ${googleFoundCount.no}`
      );
      return;
    }

    const batch = await leads
      .find({ status: "new" })
      .sort({ priority_score: -1, lead_id: 1 })
      .limit(batchSize)
      .toArray();

    console.log(`Fetched ${batch.length} un-enriched lead(s) (batch size ${batchSize})`);

    for (const lead of batch) {
      try {
        const result = await enrichOne(lead);
        await enrichment.updateOne(
          { lead_id: lead.lead_id },
          { $set: { lead_id: lead.lead_id, ...result, checked_at: new Date() } },
          { upsert: true }
        );
        await leads.updateOne({ lead_id: lead.lead_id }, { $set: { status: "enriched" } });
        processed += 1;
        websiteFoundCount[result.website.found ? "yes" : "no"] += 1;
        console.log(
          `  lead_id ${lead.lead_id} (${lead.name}): website=${result.website.found ? "found" : "not found"}`
        );
      } catch (err) {
        failed += 1;
        console.error(`  lead_id ${lead.lead_id} (${lead.name}) failed:`, err);
      }
    }
  } finally {
    await client.close();
  }

  console.log(
    `Done. Processed: ${processed}, failed: ${failed}, websites found: ${websiteFoundCount.yes}, not found: ${websiteFoundCount.no}`
  );
}

main().catch((err) => {
  console.error("Enrichment run failed:", err);
  process.exit(1);
});
