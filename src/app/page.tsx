export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-28 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-600 text-2xl font-bold text-white shadow-sm">
        S
      </span>
      <h1 className="mt-6 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        Samvid Lead Engine
      </h1>
      <p className="mt-2 max-w-md text-zinc-500 dark:text-zinc-400">
        Internal tool for lead enrichment, digital-presence reporting, and outreach.
      </p>
      <a
        href="/dashboard"
        className="mt-6 rounded-md bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-500"
      >
        Go to Dashboard
      </a>
    </div>
  );
}
