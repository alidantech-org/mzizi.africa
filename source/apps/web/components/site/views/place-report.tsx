/** A place's report card (`/<place>/report`): the headline figures from each section on one page, each linking to its section. A server component. */
import Link from "next/link";

import { Loaded } from "#/components/site/loaded.tsx";
import { Breadcrumbs, Gaps, PageFrame, PlaceTabs, Section, Stat } from "#/components/site/ui/primitives.tsx";
import { n, pct, short } from "#/lib/site/format.ts";
import { civicOf, indicatorByRole, placeElections, statisticsOf } from "#/lib/site/insights.ts";
import { placeAt } from "#/lib/site/links.ts";

export default async function PlaceReport({ id, name, path }: { id: string; name: string; path: string }) {
  return (
    <PageFrame>
      <Loaded read={async () => {
        const [stats, elections, civic] = await Promise.all([statisticsOf(id).catch(() => null), placeElections(id).catch(() => null), civicOf(id).catch(() => null)]);
        return { stats, elections, civic };
      }}>
        {({ stats, elections, civic }) => {
          const pop = stats ? indicatorByRole(stats, "population") : undefined;
          const density = stats ? indicatorByRole(stats, "density") : undefined;
          const latest = elections?.elections[0]?.contests[0];
          const gaps = [...(stats?.gaps ?? []), ...(elections?.gaps ?? []), ...(civic?.gaps ?? [])];
          return (
            <>
              <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: name, href: placeAt(path, "") }, { label: "Report" }]} />
              <PlaceTabs path={path} />
              <p className="kicker">Report card</p>
              <h1 className="hero-title text-4xl sm:text-5xl">{name}</h1>
              <Section kicker="People" title="Numbers">
                <div className="grid gap-4 sm:grid-cols-3">
                  <Stat label="People" value={short(pop?.latest.value)} hint={pop ? `${pop.latest.period.slice(0, 4)}${pop.latest.estimated ? " · estimate" : ""}` : undefined} />
                  <Stat label="People per km²" value={n(density?.latest.value)} />
                  <Stat label="Rank by population" value={stats?.siblings.population ? `#${stats.siblings.population.position}` : "—"} hint={stats?.siblings.population ? `of ${stats.siblings.population.of}` : undefined} />
                </div>
                <p className="mt-3"><Link className="underline" href={placeAt(path, "data/statistics")}>All statistics →</Link></p>
              </Section>
              <Section kicker="Voting" title="Elections">
                <div className="grid gap-4 sm:grid-cols-3">
                  <Stat label="Registered voters" value={short(latest?.registered)} />
                  <Stat label="Turnout at the last election" value={pct(latest?.turnout)} />
                  <Stat label="Elections recorded" value={n(elections?.elections.length)} />
                </div>
                <p className="mt-3"><Link className="underline" href={placeAt(path, "elections")}>Election history →</Link></p>
              </Section>
              <Section kicker="Money" title="Projects and funds">
                <div className="grid gap-4 sm:grid-cols-3">
                  <Stat label="Projects on record" value={n(civic?.projects.length)} />
                  <Stat label="Fund years recorded" value={n(civic?.years.length)} />
                </div>
                <p className="mt-3"><Link className="underline" href={placeAt(path, "finance")}>Money and projects →</Link></p>
              </Section>
              <Gaps items={gaps} topic={`the report for ${name}`} />
            </>
          );
        }}
      </Loaded>
    </PageFrame>
  );
}
