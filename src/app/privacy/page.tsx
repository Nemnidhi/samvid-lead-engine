export default function Privacy() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16 text-zinc-800 dark:text-zinc-200">
      <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
        Privacy Policy
      </h1>
      <p className="mt-2 text-sm text-zinc-500">Samvid Lead Engine - internal tool</p>

      <div className="mt-8 space-y-6 text-sm leading-6">
        <p>
          Samvid Lead Engine is an internal business-development tool. It is not a
          public-facing product and does not collect data from visitors to this
          page or from members of the public.
        </p>

        <section>
          <h2 className="font-semibold text-black dark:text-zinc-50">
            What data we process
          </h2>
          <p className="mt-1">
            The tool processes business contact information for real-estate
            agents and firms (business name, phone, email, registration number,
            and public registry district/state) sourced from public state RERA
            (Real Estate Regulatory Authority) registries. It also checks
            publicly available signals of a business&apos;s digital presence,
            such as whether a website or Google Business listing exists.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-black dark:text-zinc-50">
            How data is used
          </h2>
          <p className="mt-1">
            This data is used solely for internal sales outreach - to generate a
            summary report of a business&apos;s digital presence and to contact
            that business about our services. Data is stored in a private
            database and is not sold or shared with third parties.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-black dark:text-zinc-50">Contact</h2>
          <p className="mt-1">
            Questions about this policy can be directed to the site owner via
            the contact details provided in our outreach communications.
          </p>
        </section>
      </div>
    </div>
  );
}
