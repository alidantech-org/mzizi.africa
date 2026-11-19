/** `/data/coverage`: what the platform expects to be published, what was checked and what is missing. A server page. */
import { Loaded } from "#/components/site/loaded.tsx";
import { Breadcrumbs, Gaps, PageFrame } from "#/components/site/ui/primitives.tsx";
import { date } from "#/lib/site/format.ts";
import { T } from "#/lib/site/i18n.tsx";
import { coverage } from "#/lib/site/ledger.ts";

export const dynamic = "force-dynamic";

export default function CoverageRoute() {
  return (
    <PageFrame>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Data", href: "/data/statistics" }, { label: "Coverage" }]} />
      <p className="kicker"><T>{"What we have, and what we do not"}</T></p>
      <h1 className="hero-title text-4xl sm:text-5xl"><T>{"Coverage"}</T></h1>
      <p className="mt-2 max-w-2xl text-content-muted"><T>{"For each kind of record: what is published, where it comes from, when it was last checked and what is missing."}</T></p>
      <Loaded read={coverage}>
        {({ items, gaps }) => (
          <>
            <ul className="mt-6 grid gap-4 md:grid-cols-2">
              {items.map((c) => (
                <li key={c.code} className="glass card">
                  <p className="kicker">{c.level ?? "Coverage"}</p>
                  <h2 className="font-display text-xl">{c.subject}</h2>
                  {c.note ? <p className="mt-1 text-sm text-content-muted">{c.note}</p> : null}
                  <p className="mt-2 text-xs text-content-muted">{c.source ? `Source: ${c.source}` : "No source recorded"}{c.checkedOn ? ` · checked ${date(c.checkedOn)}` : ""}</p>
                </li>
              ))}
            </ul>
            <Gaps items={gaps} topic="coverage" />
          </>
        )}
      </Loaded>
    </PageFrame>
  );
}
