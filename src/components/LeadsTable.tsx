"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export type LeadRow = {
  leadId: number;
  name: string;
  state: string;
  district: string;
  priorityTier: string;
  status: string;
  category?: string;
  confidence?: string;
  hasReport: boolean;
};

const CATEGORY_COLOR: Record<string, string> = {
  A: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  B: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
  C: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
  D: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
};

async function generateReport(leadId: number) {
  const res = await fetch(`/api/leads/${leadId}/generate-report`, { method: "POST" });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed with status ${res.status}`);
  }
}

export default function LeadsTable({ leads }: { leads: LeadRow[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [busy, setBusy] = useState<Set<number>>(new Set());
  const [bulkStatus, setBulkStatus] = useState<string | null>(null);

  const toggle = (leadId: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(leadId)) next.delete(leadId);
      else next.add(leadId);
      return next;
    });
  };

  const toggleAll = () => {
    setSelected((prev) => (prev.size === leads.length ? new Set() : new Set(leads.map((l) => l.leadId))));
  };

  const handleGenerateOne = (leadId: number) => {
    setBusy((prev) => new Set(prev).add(leadId));
    generateReport(leadId)
      .catch((err) => alert(`Failed to generate report for lead ${leadId}: ${err.message}`))
      .finally(() => {
        setBusy((prev) => {
          const next = new Set(prev);
          next.delete(leadId);
          return next;
        });
        startTransition(() => router.refresh());
      });
  };

  const handleGenerateSelected = async () => {
    const ids = Array.from(selected);
    let done = 0;
    setBulkStatus(`Generating 0 / ${ids.length}...`);
    for (const leadId of ids) {
      try {
        await generateReport(leadId);
      } catch (err) {
        console.error(`Failed for lead ${leadId}`, err);
      }
      done += 1;
      setBulkStatus(`Generating ${done} / ${ids.length}...`);
    }
    setBulkStatus(`Done: generated ${done} report(s).`);
    setSelected(new Set());
    startTransition(() => router.refresh());
  };

  return (
    <div>
      <div className="mb-3 flex items-center gap-3">
        <button
          type="button"
          onClick={handleGenerateSelected}
          disabled={selected.size === 0}
          className="rounded bg-black px-3 py-1.5 text-sm font-medium text-white disabled:opacity-40 dark:bg-white dark:text-black"
        >
          Generate report for selected ({selected.size})
        </button>
        {bulkStatus && <span className="text-sm text-zinc-500">{bulkStatus}</span>}
        {isPending && <span className="text-sm text-zinc-500">Refreshing...</span>}
      </div>

      <div className="overflow-x-auto rounded border border-zinc-200 dark:border-zinc-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-50 dark:bg-zinc-900">
            <tr>
              <th className="px-3 py-2">
                <input
                  type="checkbox"
                  checked={leads.length > 0 && selected.size === leads.length}
                  onChange={toggleAll}
                />
              </th>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Location</th>
              <th className="px-3 py-2">Priority</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Category</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.leadId} className="border-t border-zinc-100 dark:border-zinc-800">
                <td className="px-3 py-2">
                  <input
                    type="checkbox"
                    checked={selected.has(lead.leadId)}
                    onChange={() => toggle(lead.leadId)}
                  />
                </td>
                <td className="px-3 py-2">{lead.name}</td>
                <td className="px-3 py-2 text-zinc-500">
                  {[lead.district, lead.state].filter(Boolean).join(", ")}
                </td>
                <td className="px-3 py-2">{lead.priorityTier}</td>
                <td className="px-3 py-2 text-zinc-500">{lead.status}</td>
                <td className="px-3 py-2">
                  {lead.category ? (
                    <span
                      className={`rounded px-2 py-0.5 text-xs font-medium ${CATEGORY_COLOR[lead.category] || ""}`}
                    >
                      {lead.category}
                      {lead.confidence === "partial" ? " (partial)" : ""}
                    </span>
                  ) : (
                    <span className="text-zinc-400">-</span>
                  )}
                </td>
                <td className="px-3 py-2">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleGenerateOne(lead.leadId)}
                      disabled={busy.has(lead.leadId)}
                      className="rounded border border-zinc-300 px-2 py-1 text-xs disabled:opacity-40 dark:border-zinc-700"
                    >
                      {busy.has(lead.leadId) ? "Working..." : lead.hasReport ? "Regenerate" : "Generate"}
                    </button>
                    {lead.hasReport && (
                      <a
                        href={`/api/leads/${lead.leadId}/report`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded border border-zinc-300 px-2 py-1 text-xs dark:border-zinc-700"
                      >
                        Preview
                      </a>
                    )}
                    <button
                      type="button"
                      disabled
                      title="Send pipeline not built yet (Phase 7)"
                      className="rounded border border-zinc-200 px-2 py-1 text-xs text-zinc-400 dark:border-zinc-800"
                    >
                      Send
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
