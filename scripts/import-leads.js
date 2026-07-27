// One-off script to import leads from a CSV into the `leads` MongoDB collection.
// Usage: node scripts/import-leads.js [path/to/leads.csv]
// Defaults to data/sample-leads.csv (a 10-row synthetic test file) when no path is given.

require("dotenv").config();

const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse/sync");
const { MongoClient } = require("mongodb");

const REQUIRED_COLUMNS = [
  "state",
  "name",
  "agent_type",
  "district",
  "phone",
  "email",
  "registration_no",
  "priority_score",
  "priority_tier",
];

function loadRows(csvPath) {
  const raw = fs.readFileSync(csvPath, "utf8");
  return parse(raw, {
    columns: true,
    trim: true,
    skip_empty_lines: true,
  });
}

function validateRow(row, rowNumber) {
  const errors = [];
  for (const col of REQUIRED_COLUMNS) {
    if (!row[col]) {
      errors.push(`missing "${col}"`);
    }
  }
  if (row.priority_score && Number.isNaN(Number(row.priority_score))) {
    errors.push(`priority_score "${row.priority_score}" is not a number`);
  }
  return errors.length ? `row ${rowNumber}: ${errors.join(", ")}` : null;
}

async function main() {
  const csvPath = path.resolve(
    process.argv[2] || path.join(__dirname, "..", "data", "sample-leads.csv")
  );

  if (!fs.existsSync(csvPath)) {
    console.error(`CSV not found: ${csvPath}`);
    process.exit(1);
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("Missing MONGODB_URI environment variable (check your .env file).");
    process.exit(1);
  }
  const dbName = process.env.MONGODB_DB || "samvid_lead_engine";

  const rows = loadRows(csvPath);
  console.log(`Loaded ${rows.length} row(s) from ${csvPath}`);

  const errors = [];
  const validRows = [];
  rows.forEach((row, i) => {
    const err = validateRow(row, i + 2); // +2: header line + 1-indexing
    if (err) {
      errors.push(err);
    } else {
      validRows.push(row);
    }
  });

  const client = new MongoClient(uri);
  let inserted = 0;
  let updated = 0;

  try {
    await client.connect();
    const leads = client.db(dbName).collection("leads");

    for (const row of validRows) {
      const result = await leads.updateOne(
        { registration_no: row.registration_no },
        {
          $set: {
            state: row.state,
            name: row.name,
            agent_type: row.agent_type,
            district: row.district,
            phone: row.phone,
            email: row.email,
            registration_no: row.registration_no,
            priority_score: Number(row.priority_score),
            priority_tier: row.priority_tier,
          },
          $setOnInsert: { status: "new" },
        },
        { upsert: true }
      );
      if (result.upsertedCount > 0) {
        inserted += 1;
      } else if (result.modifiedCount > 0) {
        updated += 1;
      }
    }
  } finally {
    await client.close();
  }

  console.log(`Inserted: ${inserted}, updated: ${updated}, unchanged: ${validRows.length - inserted - updated}`);
  if (errors.length) {
    console.warn(`Skipped ${errors.length} invalid row(s):`);
    errors.forEach((e) => console.warn(`  - ${e}`));
  }
}

main().catch((err) => {
  console.error("Import failed:", err);
  process.exit(1);
});
