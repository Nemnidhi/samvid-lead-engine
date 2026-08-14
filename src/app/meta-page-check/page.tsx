"use client";

import { useState } from "react";

type PageResult = {
  id: string;
  name: string;
  link?: string;
  location?: { city?: string; country?: string };
  verification_status?: string;
};

export default function MetaPageCheck() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PageResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setResults(null);
    try {
      const res = await fetch(`/api/meta-page-search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Search failed");
      setResults(data.data || []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl px-6 py-16">
      <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
        Facebook Page Lookup
      </h1>
      <p className="mt-2 text-sm text-zinc-500">
        Search a business name to check whether it already has a public Facebook Page - part of
        Samvid&apos;s digital-presence audit for prospective clients. This calls the Meta Graph
        API server-to-server with the app&apos;s own App Access Token (no visitor login involved,
        since Page Public Metadata Access is an app-level feature, not a per-user permission).
      </p>

      <div className="mt-4 flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Business name"
          className="flex-1 rounded border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
        <button
          type="button"
          onClick={handleSearch}
          disabled={loading || !query}
          className="rounded bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-40 dark:bg-white dark:text-black"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {error && (
        <p className="mt-4 rounded bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {error}
        </p>
      )}

      {results && (
        <div className="mt-4 space-y-2">
          {results.length === 0 && <p className="text-sm text-zinc-500">No Page found.</p>}
          {results.map((page) => (
            <div key={page.id} className="rounded border border-zinc-200 p-3 text-sm dark:border-zinc-800">
              <div className="font-medium">{page.name}</div>
              {page.location && (
                <div className="text-zinc-500">
                  {[page.location.city, page.location.country].filter(Boolean).join(", ")}
                </div>
              )}
              {page.link && (
                <a href={page.link} target="_blank" rel="noopener noreferrer" className="underline">
                  {page.link}
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
