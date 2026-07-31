import { getDb } from "@/lib/mongodb";
import LeadsTable, { type LeadRow } from "@/components/LeadsTable";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 50;

type SearchParams = {
  page?: string;
  status?: string;
  category?: string;
  tier?: string;
  q?: string;
};

function buildFilter(sp: SearchParams) {
  const filter: Record<string, unknown> = {};
  if (sp.status) filter.status = sp.status;
  if (sp.category) filter.classification_category = sp.category;
  if (sp.tier) filter.priority_tier = sp.tier;
  if (sp.q) filter.name = { $regex: sp.q, $options: "i" };
  return filter;
}

function queryString(sp: SearchParams, overrides: Partial<SearchParams>) {
  const merged = { ...sp, ...overrides };
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(merged)) {
    if (value) params.set(key, value);
  }
  return `?${params.toString()}`;
}

const CATEGORY_STYLE: Record<string, string> = {
  A: "text-red-600 dark:text-red-400",
  B: "text-orange-600 dark:text-orange-400",
  C: "text-yellow-600 dark:text-yellow-400",
  D: "text-green-600 dark:text-green-400",
};

const SELECT_CLASS =
  "mt-1 rounded-md border border-zinc-300 bg-white px-2.5 py-1.5 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900";

export default async function Dashboard({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);
  const filter = buildFilter(sp);

  const db = await getDb();
  const leadsCollection = db.collection("leads");

  const [total, docs, categoryCounts, totalLeads] = await Promise.all([
    leadsCollection.countDocuments(filter),
    leadsCollection
      .find(filter)
      .sort({ priority_score: -1, lead_id: 1 })
      .skip((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .toArray(),
    leadsCollection
      .aggregate([{ $group: { _id: "$classification_category", count: { $sum: 1 } } }])
      .toArray(),
    leadsCollection.countDocuments({}),
  ]);

  const categoryCountMap = new Map(categoryCounts.map((c) => [c._id as string | null, c.count as number]));

  const leadIds = docs.map((d) => d.lead_id as number);
  const reportDocs = await db
    .collection("reports")
    .find({ lead_id: { $in: leadIds } }, { projection: { lead_id: 1 } })
    .toArray();
  const reportedIds = new Set(reportDocs.map((d) => d.lead_id as number));

  const sendHistory = await db
    .collection("outreach_log")
    .aggregate([
      { $match: { lead_id: { $in: leadIds } } },
      { $group: { _id: "$lead_id", count: { $sum: 1 }, lastSentAt: { $max: "$sent_at" } } },
    ])
    .toArray();
  const sendHistoryByLeadId = new Map(
    sendHistory.map((h) => [h._id as number, { count: h.count as number, lastSentAt: h.lastSentAt as Date }])
  );

  const rows: LeadRow[] = docs.map((d) => {
    const history = sendHistoryByLeadId.get(d.lead_id as number);
    return {
      leadId: d.lead_id as number,
      name: d.name as string,
      email: (d.email as string) || "",
      phone: (d.phone as string) || "",
      state: (d.state as string) || "",
      district: (d.district as string) || "",
      priorityTier: (d.priority_tier as string) || "",
      status: d.status as string,
      category: (d.classification_category as string) || undefined,
      confidence: (d.classification_confidence as string) || undefined,
      hasReport: reportedIds.has(d.lead_id as number),
      sendCount: history?.count ?? 0,
      lastSentAt: history?.lastSentAt ? history.lastSentAt.toISOString() : undefined,
    };
  });

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const unclassified = totalLeads - Array.from(categoryCountMap.values()).reduce((a, b) => a + b, 0);

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">Dashboard</h1>
      <p className="mt-1 text-sm text-zinc-500">Leads, digital-presence classification, and outreach.</p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="text-xs font-medium text-zinc-500">Total leads</div>
          <div className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">{totalLeads}</div>
        </div>
        {(["A", "B", "C", "D"] as const).map((cat) => (
          <div
            key={cat}
            className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
          >
            <div className="text-xs font-medium text-zinc-500">Tier {cat}</div>
            <div className={`mt-1 text-2xl font-semibold ${CATEGORY_STYLE[cat]}`}>
              {categoryCountMap.get(cat) ?? 0}
            </div>
          </div>
        ))}
        <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="text-xs font-medium text-zinc-500">Unclassified</div>
          <div className="mt-1 text-2xl font-semibold text-zinc-400">{unclassified}</div>
        </div>
      </div>

      <form
        className="mt-6 flex flex-wrap items-end gap-3 rounded-lg border border-zinc-200 bg-white p-4 text-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
        method="get"
      >
        <div>
          <label className="block text-xs font-medium text-zinc-500">Search name</label>
          <input
            type="text"
            name="q"
            defaultValue={sp.q || ""}
            className="mt-1 rounded-md border border-zinc-300 bg-white px-2.5 py-1.5 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-500">Status</label>
          <select name="status" defaultValue={sp.status || ""} className={SELECT_CLASS}>
            <option value="">All</option>
            <option value="new">new</option>
            <option value="enriched">enriched</option>
            <option value="classified">classified</option>
            <option value="reported">reported</option>
            <option value="sent">sent</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-500">Category</label>
          <select name="category" defaultValue={sp.category || ""} className={SELECT_CLASS}>
            <option value="">All</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-500">Priority tier</label>
          <select name="tier" defaultValue={sp.tier || ""} className={SELECT_CLASS}>
            <option value="">All</option>
            <option value="Top">Top</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-500"
        >
          Filter
        </button>
        {(sp.q || sp.status || sp.category || sp.tier) && (
          <a href="/dashboard" className="text-sm text-zinc-500 underline hover:text-zinc-700 dark:hover:text-zinc-300">
            Clear filters
          </a>
        )}
        <span className="ml-auto self-center text-xs text-zinc-500">
          {total} lead{total === 1 ? "" : "s"} matching
        </span>
      </form>

      <div className="mt-6">
        <LeadsTable leads={rows} />
      </div>

      <div className="mt-4 flex items-center justify-center gap-2 text-sm">
        <a
          href={queryString(sp, { page: String(Math.max(1, page - 1)) })}
          className={`rounded-md border border-zinc-300 px-3 py-1.5 dark:border-zinc-700 ${
            page <= 1 ? "pointer-events-none opacity-40" : "hover:bg-zinc-50 dark:hover:bg-zinc-900"
          }`}
        >
          Previous
        </a>
        <span className="px-2 text-zinc-500">
          Page {page} of {totalPages}
        </span>
        <a
          href={queryString(sp, { page: String(Math.min(totalPages, page + 1)) })}
          className={`rounded-md border border-zinc-300 px-3 py-1.5 dark:border-zinc-700 ${
            page >= totalPages ? "pointer-events-none opacity-40" : "hover:bg-zinc-50 dark:hover:bg-zinc-900"
          }`}
        >
          Next
        </a>
      </div>
    </div>
  );
}
