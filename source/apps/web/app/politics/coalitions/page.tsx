/** `/politics/coalitions`: coalitions of parties. A server page; empty until a published source is added, and it says so. */
import { Loaded } from "#/components/site/loaded.tsx";
import { Breadcrumbs, Gaps, PageFrame } from "#/components/site/ui/primitives.tsx";
import { date } from "#/lib/site/format.ts";
import { T } from "#/lib/site/i18n.tsx";
import { coalitions } from "#/lib/site/ledger.ts";

export const dynamic = "force-dynamic";

export default function CoalitionsRoute() {
  return (
    <PageFrame>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Politics", href: "/politics/parties" }, { label: "Coalitions" }]} />
      <p className="kicker"><T>{"Politics"}</T></p>
      <h1 className="hero-title text-4xl sm:text-5xl"><T>{"Coalitions"}</T></h1>
      <Loaded read={coalitions}>
        {({ coalitions: list, gaps }) => (
          <>
            <ul className="mt-6 grid gap-4 md:grid-cols-2">
              {list.map((c) => (
                <li key={c.code} className="glass card">
                  <p className="kicker">{c.kind}</p>
                  <h2 className="font-display text-xl">{c.name}</h2>
                  <p className="text-sm text-content-muted">{c.formedOn ? `Formed ${date(c.formedOn)}` : ""}{c.dissolvedOn ? ` · dissolved ${date(c.dissolvedOn)}` : ""}</p>
                </li>
              ))}
            </ul>
            <Gaps items={gaps} topic="coalitions" />
          </>
        )}
      </Loaded>
    </PageFrame>
  );
}
