"use client";

import { useEffect, useState } from "react";

type PageResult = {
  id: string;
  name: string;
  link?: string;
  location?: { city?: string; country?: string };
  verification_status?: string;
};

type PostResult = {
  id: string;
  message?: string;
  created_time?: string;
  permalink_url?: string;
};

type DiscoveryResult = {
  username?: string;
  followers_count?: number;
  media_count?: number;
  biography?: string;
};

export default function MetaPageCheck() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PageResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [pageId, setPageId] = useState("");
  const [posts, setPosts] = useState<PostResult[] | null>(null);
  const [postsError, setPostsError] = useState<string | null>(null);
  const [postsLoading, setPostsLoading] = useState(false);

  const [igConnected, setIgConnected] = useState(false);
  const [igError, setIgError] = useState<string | null>(null);
  const [igUsername, setIgUsername] = useState("");
  const [discovery, setDiscovery] = useState<DiscoveryResult | null>(null);
  const [discoveryError, setDiscoveryError] = useState<string | null>(null);
  const [discoveryLoading, setDiscoveryLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("ig_connected")) setIgConnected(true);
    if (params.get("ig_error")) setIgError(params.get("ig_error"));
  }, []);

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

  const handlePostsCheck = async () => {
    setPostsLoading(true);
    setPostsError(null);
    setPosts(null);
    try {
      const res = await fetch(`/api/meta-page-posts?pageId=${encodeURIComponent(pageId)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lookup failed");
      setPosts(data.data || []);
    } catch (err) {
      setPostsError((err as Error).message);
    } finally {
      setPostsLoading(false);
    }
  };

  const handleDiscovery = async () => {
    setDiscoveryLoading(true);
    setDiscoveryError(null);
    setDiscovery(null);
    try {
      const res = await fetch(`/api/instagram-discovery?username=${encodeURIComponent(igUsername)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lookup failed");
      setDiscovery(data.business_discovery || null);
    } catch (err) {
      setDiscoveryError((err as Error).message);
    } finally {
      setDiscoveryLoading(false);
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

      <hr className="mt-10 border-zinc-200 dark:border-zinc-800" />

      <h2 className="mt-10 text-xl font-semibold tracking-tight text-black dark:text-zinc-50">
        Facebook Page Activity
      </h2>
      <p className="mt-2 text-sm text-zinc-500">
        Read a Page&apos;s recent posts to check activity/staleness - this needs the broader Page
        Public Content Access feature (Page Public Metadata Access above only covers Page-level
        metadata, not post content). Same App Access Token mechanism, still no visitor login.
      </p>

      <div className="mt-4 flex gap-2">
        <input
          value={pageId}
          onChange={(e) => setPageId(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handlePostsCheck()}
          placeholder="Page ID or username (e.g. Nemnidhi's Page ID 82215367655733)"
          className="flex-1 rounded border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
        <button
          type="button"
          onClick={handlePostsCheck}
          disabled={postsLoading || !pageId}
          className="rounded bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-40 dark:bg-white dark:text-black"
        >
          {postsLoading ? "Checking..." : "Check Posts"}
        </button>
      </div>

      {postsError && (
        <p className="mt-4 rounded bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {postsError}
        </p>
      )}

      {posts && (
        <div className="mt-4 space-y-2">
          {posts.length === 0 && <p className="text-sm text-zinc-500">No posts found.</p>}
          {posts.map((post) => (
            <div key={post.id} className="rounded border border-zinc-200 p-3 text-sm dark:border-zinc-800">
              {post.message && <div>{post.message}</div>}
              {post.created_time && <div className="text-zinc-500">{post.created_time}</div>}
            </div>
          ))}
        </div>
      )}

      <hr className="mt-10 border-zinc-200 dark:border-zinc-800" />

      <h2 className="mt-10 text-xl font-semibold tracking-tight text-black dark:text-zinc-50">
        Instagram Presence Lookup
      </h2>
      <p className="mt-2 text-sm text-zinc-500">
        Look up any public Instagram Professional account&apos;s follower count and post count via
        Business Discovery. Unlike the Facebook checks above, this genuinely needs a real login -
        once, from Nemnidhi&apos;s own account (<code>nemnidhi.official</code>, already connected
        to the Nemnidhi Facebook Page), which becomes the querying identity Business Discovery
        looks other public accounts up from.
      </p>

      {igError && (
        <p className="mt-4 rounded bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          Connection failed: {igError}
        </p>
      )}

      {!igConnected ? (
        <a
          href="/api/auth/instagram/start"
          className="mt-4 inline-block rounded bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] px-4 py-2 text-sm font-medium text-white"
        >
          Connect Nemnidhi&apos;s Instagram
        </a>
      ) : (
        <>
          <p className="mt-4 text-sm text-green-700 dark:text-green-400">
            Nemnidhi&apos;s Instagram is connected.
          </p>
          <div className="mt-2 flex gap-2">
            <input
              value={igUsername}
              onChange={(e) => setIgUsername(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleDiscovery()}
              placeholder="Instagram username (without @)"
              className="flex-1 rounded border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            />
            <button
              type="button"
              onClick={handleDiscovery}
              disabled={discoveryLoading || !igUsername}
              className="rounded bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-40 dark:bg-white dark:text-black"
            >
              {discoveryLoading ? "Looking up..." : "Look Up"}
            </button>
          </div>
        </>
      )}

      {discoveryError && (
        <p className="mt-4 rounded bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {discoveryError}
        </p>
      )}

      {discovery && (
        <div className="mt-4 rounded border border-zinc-200 p-3 text-sm dark:border-zinc-800">
          <div className="font-medium">@{discovery.username}</div>
          <div className="text-zinc-500">
            {discovery.followers_count?.toLocaleString()} followers · {discovery.media_count} posts
          </div>
          {discovery.biography && <div className="mt-1">{discovery.biography}</div>}
        </div>
      )}
    </div>
  );
}
