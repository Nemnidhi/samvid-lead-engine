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

  const total = await leadsCollection.countDocuments(filter);
  const docs = await leadsCollection
    .find(filter)
    .sort({ priority_score: -1, lead_id: 1 })
    .skip((page - 1) * PAGE_SIZE)
    .limit(PAGE_SIZE)
    .toArray();

  const leadIds = docs.map((d) => d.lead_id as number);
  const reportDocs = await db
    .collection("reports")
    .find({ lead_id: { $in: leadIds } }, { projection: { lead_id: 1 } })
    .toArray();
  const reportedIds = new Set(reportDocs.map((d) => d.lead_id as number));

  const rows: LeadRow[] = docs.map((d) => ({
    leadId: d.lead_id as number,
    name: d.name as string,
    state: (d.state as string) || "",
    district: (d.district as string) || "",
    priorityTier: (d.priority_tier as string) || "",
    status: d.status as string,
    category: (d.classification_category as string) || undefined,
    confidence: (d.classification_confidence as string) || undefined,
    hasReport: reportedIds.has(d.lead_id as number),
  }));

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
        Samvid Lead Engine - Dashboard
      </h1>
      <p className="mt-1 text-sm text-zinc-500">
        {total} lead{total === 1 ? "" : "s"} matching current filters
      </p>

      <form className="mt-6 flex flex-wrap items-end gap-3 text-sm" method="get">
        <div>
          <label className="block text-xs font-medium text-zinc-500">Search name</label>
          <input
            type="text"
            name="q"
            defaultValue={sp.q || ""}
            className="mt-1 rounded border border-zinc-300 px-2 py-1 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-500">Status</label>
          <select
            name="status"
            defaultValue={sp.status || ""}
            className="mt-1 rounded border border-zinc-300 px-2 py-1 dark:border-zinc-700 dark:bg-zinc-900"
          >
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
          <select
            name="category"
            defaultValue={sp.category || ""}
            className="mt-1 rounded border border-zinc-300 px-2 py-1 dark:border-zinc-700 dark:bg-zinc-900"
          >
            <option value="">All</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-500">Priority tier</label>
          <select
            name="tier"
            defaultValue={sp.tier || ""}
            className="mt-1 rounded border border-zinc-300 px-2 py-1 dark:border-zinc-700 dark:bg-zinc-900"
          >
            <option value="">All</option>
            <option value="Top">Top</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
        <button
          type="submit"
          className="rounded bg-black px-4 py-1.5 text-sm font-medium text-white dark:bg-white dark:text-black"
        >
          Filter
        </button>
      </form>

      <div className="mt-6">
        <LeadsTable leads={rows} />
      </div>

      <div className="mt-4 flex items-center gap-4 text-sm">
        <a
          href={queryString(sp, { page: String(Math.max(1, page - 1)) })}
          className={`underline ${page <= 1 ? "pointer-events-none opacity-40" : ""}`}
        >
          Previous
        </a>
        <span className="text-zinc-500">
          Page {page} of {totalPages}
        </span>
        <a
          href={queryString(sp, { page: String(Math.min(totalPages, page + 1)) })}
          className={`underline ${page >= totalPages ? "pointer-events-none opacity-40" : ""}`}
        >
          Next
        </a>
      </div>
    </div>
  );
}
