export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-col items-center gap-3 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
          Samvid Lead Engine
        </h1>
        <p className="max-w-md text-zinc-600 dark:text-zinc-400">
          Internal lead-enrichment and outreach tool.
        </p>
        <a
          href="/dashboard"
          className="mt-2 rounded bg-black px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-black"
        >
          Go to Dashboard
        </a>
      </main>
    </div>
  );
}
