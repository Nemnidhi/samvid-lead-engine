export default function DataDeletion() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16 text-zinc-800 dark:text-zinc-200">
      <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
        Data Deletion Instructions
      </h1>
      <p className="mt-2 text-sm text-zinc-500">Samvid Lead Engine - internal tool</p>

      <div className="mt-8 space-y-6 text-sm leading-6">
        <p>
          Samvid Lead Engine does not use Facebook Login and does not collect
          any data through Meta/Facebook on behalf of individual users.
        </p>

        <section>
          <h2 className="font-semibold text-black dark:text-zinc-50">
            If your business appears in our records
          </h2>
          <p className="mt-1">
            The business contact information we hold (name, phone, email,
            registration number) is sourced from public state RERA (Real
            Estate Regulatory Authority) registries and used solely for
            business-development outreach. To request removal of your
            business&apos;s data from our records, email{" "}
            <a
              href="mailto:somiljain00@gmail.com"
              className="underline underline-offset-2"
            >
              somiljain00@gmail.com
            </a>{" "}
            with the business name and registration number, and it will be
            deleted within a reasonable time.
          </p>
        </section>
      </div>
    </div>
  );
}
