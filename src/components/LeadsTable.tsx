"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export type LeadRow = {
  leadId: number;
  name: string;
  email: string;
  phone: string;
  state: string;
  district: string;
  priorityTier: string;
  status: string;
  category?: string;
  confidence?: string;
  hasReport: boolean;
  sendCount: number;
  lastSentAt?: string;
};

const CATEGORY_COLOR: Record<string, string> = {
  A: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  B: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
  C: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
  D: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
};

const STATUS_COLOR: Record<string, string> = {
  new: "text-zinc-500",
  enriched: "text-blue-600 dark:text-blue-400",
  classified: "text-indigo-600 dark:text-indigo-400",
  reported: "text-purple-600 dark:text-purple-400",
  sent: "text-green-600 dark:text-green-400",
};

let errorIdCounter = 0;

async function generateReport(leadId: number) {
  const res = await fetch(`/api/leads/${leadId}/generate-report`, { method: "POST" });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed with status ${res.status}`);
  }
}

async function sendReport(leadId: number) {
  const res = await fetch(`/api/leads/${leadId}/send`, { method: "POST" });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed with status ${res.status}`);
  }
}

function formatSentAt(iso?: string) {
  if (!iso) return null;
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function Spinner() {
  return (
    <svg className="h-3 w-3 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}

export default function LeadsTable({ leads }: { leads: LeadRow[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [busy, setBusy] = useState<Set<number>>(new Set());
  const [bulkStatus, setBulkStatus] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ id: number; message: string }[]>([]);

  const addError = (message: string) => {
    const id = errorIdCounter++;
    setErrors((prev) => [...prev, { id, message }]);
  };

  const dismissError = (id: number) => {
    setErrors((prev) => prev.filter((e) => e.id !== id));
  };

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
      .catch((err) => addError(`Failed to generate report for lead ${leadId}: ${err.message}`))
      .finally(() => {
        setBusy((prev) => {
          const next = new Set(prev);
          next.delete(leadId);
          return next;
        });
        startTransition(() => router.refresh());
      });
  };

  const handleSendOne = (lead: LeadRow) => {
    const confirmed = window.confirm(
      `Send outreach email with the attached report to ${lead.name} <${lead.email}>?\n\nThis sends a REAL email.`
    );
    if (!confirmed) return;

    setBusy((prev) => new Set(prev).add(lead.leadId));
    sendReport(lead.leadId)
      .catch((err) => addError(`Failed to send to lead ${lead.leadId}: ${err.message}`))
      .finally(() => {
        setBusy((prev) => {
          const next = new Set(prev);
          next.delete(lead.leadId);
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
        addError(`Failed to generate report for lead ${leadId}: ${(err as Error).message}`);
      }
      done += 1;
      setBulkStatus(`Generating ${done} / ${ids.length}...`);
    }
    setBulkStatus(`Done: generated ${done} report(s).`);
    setSelected(new Set());
    startTransition(() => router.refresh());
  };

  const handleSendSelected = async () => {
    const targets = leads.filter((l) => selected.has(l.leadId) && l.hasReport);
    const skipped = selected.size - targets.length;
    const confirmed = window.confirm(
      `Send outreach emails to ${targets.length} lead(s)?${
        skipped > 0 ? ` (${skipped} skipped - no report generated yet)` : ""
      }\n\nThis sends REAL emails and is subject to the daily send limit.`
    );
    if (!confirmed) return;

    let done = 0;
    setBulkStatus(`Sending 0 / ${targets.length}...`);
    for (const lead of targets) {
      try {
        await sendReport(lead.leadId);
      } catch (err) {
        addError(`Failed to send to lead ${lead.leadId}: ${(err as Error).message}`);
        setBulkStatus(`Stopped after ${done} / ${targets.length}: ${(err as Error).message}`);
        break;
      }
      done += 1;
      setBulkStatus(`Sending ${done} / ${targets.length}...`);
    }
    if (done === targets.length) {
      setBulkStatus(`Done: sent ${done} email(s).`);
    }
    setSelected(new Set());
    startTransition(() => router.refresh());
  };

  return (
    <div>
      {errors.length > 0 && (
        <div className="fixed right-4 top-4 z-50 w-80 space-y-2">
          {errors.map((e) => (
            <div
              key={e.id}
              className="flex items-start justify-between gap-3 rounded-lg border border-red-200 bg-white px-3 py-2.5 text-sm text-red-800 shadow-lg dark:border-red-900 dark:bg-zinc-950 dark:text-red-300"
            >
              <span>{e.message}</span>
              <button
                type="button"
                onClick={() => dismissError(e.id)}
                className="shrink-0 text-red-400 hover:text-red-600 dark:text-red-500"
                aria-label="Dismiss"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mb-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleGenerateSelected}
          disabled={selected.size === 0}
          className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600"
        >
          Generate report for selected ({selected.size})
        </button>
        <button
          type="button"
          onClick={handleSendSelected}
          disabled={selected.size === 0}
          className="rounded-md border border-red-300 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-40 disabled:hover:bg-transparent dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/40"
        >
          Send selected ({selected.size})
        </button>
        {bulkStatus && <span className="text-sm text-zinc-500">{bulkStatus}</span>}
        {isPending && (
          <span className="flex items-center gap-1.5 text-sm text-zinc-500">
            <Spinner /> Refreshing...
          </span>
        )}
      </div>

      <div className="overflow-x-auto rounded-lg border border-zinc-200 shadow-sm dark:border-zinc-800">
        <table className="w-full text-left text-sm">
          <thead className="sticky top-0 bg-zinc-50 dark:bg-zinc-900">
            <tr>
              <th className="px-3 py-2.5">
                <input
                  type="checkbox"
                  checked={leads.length > 0 && selected.size === leads.length}
                  onChange={toggleAll}
                />
              </th>
              <th className="px-3 py-2.5 font-medium text-zinc-500">Name</th>
              <th className="px-3 py-2.5 font-medium text-zinc-500">Contact</th>
              <th className="px-3 py-2.5 font-medium text-zinc-500">Location</th>
              <th className="px-3 py-2.5 font-medium text-zinc-500">Priority</th>
              <th className="px-3 py-2.5 font-medium text-zinc-500">Status</th>
              <th className="px-3 py-2.5 font-medium text-zinc-500">Category</th>
              <th className="px-3 py-2.5 font-medium text-zinc-500">Last Sent</th>
              <th className="px-3 py-2.5 font-medium text-zinc-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {leads.map((lead, i) => (
              <tr
                key={lead.leadId}
                className={
                  i % 2 === 0
                    ? "bg-white dark:bg-zinc-950"
                    : "bg-zinc-50/60 dark:bg-zinc-900/40"
                }
              >
                <td className="px-3 py-2.5">
                  <input
                    type="checkbox"
                    checked={selected.has(lead.leadId)}
                    onChange={() => toggle(lead.leadId)}
                  />
                </td>
                <td className="px-3 py-2.5 font-medium text-zinc-900 dark:text-zinc-100">{lead.name}</td>
                <td className="px-3 py-2.5 text-zinc-500">
                  <div>{lead.email || <span className="text-zinc-400">no email</span>}</div>
                  {lead.phone && <div className="text-xs">{lead.phone}</div>}
                </td>
                <td className="px-3 py-2.5 text-zinc-500">
                  {[lead.district, lead.state].filter(Boolean).join(", ")}
                </td>
                <td className="px-3 py-2.5">{lead.priorityTier}</td>
                <td className={`px-3 py-2.5 font-medium ${STATUS_COLOR[lead.status] || "text-zinc-500"}`}>
                  {lead.status}
                </td>
                <td className="px-3 py-2.5">
                  {lead.category ? (
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${CATEGORY_COLOR[lead.category] || ""}`}
                    >
                      {lead.category}
                      {lead.confidence === "partial" ? " (partial)" : ""}
                    </span>
                  ) : (
                    <span className="text-zinc-400">-</span>
                  )}
                </td>
                <td className="px-3 py-2.5 text-zinc-500">
                  {lead.sendCount > 0 ? (
                    <div>
                      <div>{formatSentAt(lead.lastSentAt)}</div>
                      <div className="text-xs">
                        {lead.sendCount} send{lead.sendCount === 1 ? "" : "s"}
                      </div>
                    </div>
                  ) : (
                    <span className="text-zinc-400">never</span>
                  )}
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleGenerateOne(lead.leadId)}
                      disabled={busy.has(lead.leadId)}
                      className="flex items-center gap-1 rounded-md border border-zinc-300 px-2 py-1 text-xs hover:bg-zinc-50 disabled:opacity-40 disabled:hover:bg-transparent dark:border-zinc-700 dark:hover:bg-zinc-900"
                    >
                      {busy.has(lead.leadId) && <Spinner />}
                      {busy.has(lead.leadId) ? "Working..." : lead.hasReport ? "Regenerate" : "Generate"}
                    </button>
                    {lead.hasReport && (
                      <a
                        href={`/api/leads/${lead.leadId}/report`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-md border border-zinc-300 px-2 py-1 text-xs hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
                      >
                        Preview
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => handleSendOne(lead)}
                      disabled={!lead.hasReport || busy.has(lead.leadId)}
                      title={lead.hasReport ? "Sends a real email to this lead" : "Generate a report first"}
                      className="rounded-md border border-red-300 px-2 py-1 text-xs text-red-700 hover:bg-red-50 disabled:opacity-40 disabled:hover:bg-transparent dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/40"
                    >
                      {lead.status === "sent" ? "Resend" : "Send"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {leads.length === 0 && (
              <tr>
                <td colSpan={9} className="px-3 py-10 text-center text-zinc-400">
                  No leads match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
