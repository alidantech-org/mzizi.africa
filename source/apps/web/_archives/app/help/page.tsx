/** `/help`: how to find things and how to read what is shown. */
import Link from "next/link";

import {
  Breadcrumbs,
  PageFrame,
} from "#/_archives/components/site/ui/primitives";

export default function HelpRoute() {
  return (
    <PageFrame>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Help" }]} />
      <h1 className="hero-title text-4xl sm:text-5xl">Help</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <section className="glass card">
          <h2 className="font-display text-xl">Find your place</h2>
          <p className="mt-1 text-sm text-content-muted">
            Use the place button at the top of the sidebar, or press{" "}
            <kbd>/</kbd> to search. Every section also works under a place, for
            example <code>/nairobi/elections</code>.
          </p>
        </section>
        <section className="glass card">
          <h2 className="font-display text-xl">Where does this come from?</h2>
          <p className="mt-1 text-sm text-content-muted">
            Every claim links to its evidence. See{" "}
            <Link className="underline" href="/data/sources">
              Sources
            </Link>{" "}
            and{" "}
            <Link className="underline" href="/data/coverage">
              Coverage
            </Link>{" "}
            for what is and is not published.
          </p>
        </section>
        <section className="glass card">
          <h2 className="font-display text-xl">Development data</h2>
          <p className="mt-1 text-sm text-content-muted">
            Pages that say &ldquo;Development dataset&rdquo; show invented
            examples that stand in until the real record is added. They are
            never an official record.
          </p>
        </section>
        <section className="glass card">
          <h2 className="font-display text-xl">Privacy</h2>
          <p className="mt-1 text-sm text-content-muted">
            Read what the website keeps in{" "}
            <Link className="underline" href="/me/privacy">
              Privacy
            </Link>
            .
          </p>
        </section>
      </div>
    </PageFrame>
  );
}
