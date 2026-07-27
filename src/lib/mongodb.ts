import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "samvid_lead_engine";

if (!uri) {
  throw new Error("Missing MONGODB_URI environment variable");
}

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

// Reuse the client across hot reloads / serverless invocations on the same
// warm instance instead of opening a new connection per request.
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = new MongoClient(uri).connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  clientPromise = new MongoClient(uri).connect();
}

export default clientPromise;

export async function getDb() {
  const client = await clientPromise;
  return client.db(dbName);
}
