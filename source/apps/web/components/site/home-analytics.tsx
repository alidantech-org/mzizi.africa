"use client";

/** Home: starts from Kenya in numbers, then your places compared with the country, then ways to explore. */
import Link from "next/link";

import { Icon, type IconName } from "#/components/brand/icon.tsx";
import { LocateButton } from "#/components/site/locate-button.tsx";
import { PlaceSearchBox } from "#/components/site/place-search-box.tsx";
import { StatMap } from "#/components/site/stat-map.tsx";
import { AsyncView } from "#/components/site/async-view.tsx";
import { Section, Stat } from "#/components/site/ui/primitives.tsx";
import { LineChart } from "#/components/site/ui/charts.tsx";
import { FactStrip } from "#/components/site/fact-strip.tsx";
import { n, n1, short } from "#/lib/site/format.ts";
import { boardOf, browse, elections, mapOf, seriesOf, statisticsOf, tenders } from "#/lib/site/insights.ts";
import { useLanguage } from "#/lib/site/i18n.tsx";
import { useSaved } from "#/lib/site/saved.tsx";
import { useAsync } from "#/lib/site/use-async.ts";

const MORE: readonly { href: string; icon: IconName; title: string }[] = [
  { href: "/explore", icon: "compass", title: "Explore everything" }, { href: "/profile", icon: "user", title: "Profile and preferences" },
  { href: "/institutions", icon: "parliament", title: "Institutions" }, { href: "/constitution", icon: "book", title: "The Constitution" }, { href: "/compare", icon: "chart", title: "Compare places" }, { href: "/content", icon: "book", title: "Knowledge library" },
  { href: "/browse", icon: "pin", title: "Browse places" }, { href: "/leaders", icon: "tree", title: "Leaders tree" }, { href: "/statistics", icon: "chart", title: "Statistics" },
  { href: "/elections", icon: "vote", title: "Elections" }, { href: "/parliament", icon: "parliament", title: "Parliament" }, { href: "/civic", icon: "build", title: "Money & projects" },
  { href: "/tenders", icon: "document", title: "Tenders" }, { href: "/parties", icon: "flag", title: "Parties" },
];

function Compare({ id, name }: { id: string; name: string }) {
  const { tr } = useLanguage();
  const stats = useAsync(() => statisticsOf(id), `home-stat-${id}`);
  return (
    <AsyncView loaded={stats}>
      {(s) => {
        const pop = s.topics.flatMap((t) => t.indicators).find((i) => i.code === "sta.population.total");
        const density = s.topics.flatMap((t) => t.indicators).find((i) => i.code === "sta.population.density");
        return (
          <Link href={`/statistics/${id}`} className="glass card card-lift block">
            <p className="kicker">{tr("Your place")}</p><p className="font-display text-2xl">{name}</p>
            <p className="mt-2 text-sm text-content-muted">{tr("{} people", short(pop?.latest.value))} · {tr("{} per km²", n(density?.latest.value))}</p>
            {s.siblings.population ? <p className="mt-1 text-sm">{tr("#{} of {} by population", s.siblings.population.position, s.siblings.population.of)}</p> : null}
          </Link>
        );
      }}
    </AsyncView>
  );
}

export function HomeAnalytics({ country }: { country: string }) {
  const { t, tr } = useLanguage();
  const saved = useSaved();
  const root = useAsync(() => browse(), "home-root");
  const series = useAsync(async () => (root.state === "ready" && root.value.place ? seriesOf("sta.population.total", root.value.place.featureId) : Promise.reject(new Error("wait"))), `home-series-${root.state}`);
  const map = useAsync(() => mapOf("sta.population.density", undefined, "county"), "home-map");
  const votes = useAsync(() => elections(), "home-elections");
  const tend = useAsync(() => tenders("open"), "home-tenders");
  const board = useAsync(() => boardOf("civ.projects.per-100k", "constituency", undefined, 5), "home-board");
  return (
    <div>
      <section className="pattern-bg overflow-hidden">
        <div className="relative mx-auto max-w-5xl px-5 py-14 text-center sm:py-20">
          <p className="reveal kicker">{t("tagline")}</p>
          <h1 className="reveal reveal-1 hero-title mt-3 text-4xl sm:text-6xl">{tr("Know your place in {}", country)}</h1>
          <p className="reveal reveal-2 mx-auto mt-4 max-w-2xl text-lg text-content-muted">{t("heroBody")}</p>
          <div className="reveal reveal-3 mx-auto mt-8 flex max-w-xl flex-col items-center gap-4">
            <LocateButton />
            <div className="w-full"><PlaceSearchBox /></div>
          </div>
        </div>
      </section>
      <div className="mx-auto max-w-7xl px-5 pb-8">
        <Section kicker="The country" title={tr("{} at a glance", country)}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <AsyncView loaded={series}>{(s) => <Stat label="People" value={short(s.points.at(-1)?.value)} hint={`${tr("{} estimate", s.points.at(-1)?.period.slice(0, 4))} · ${n(s.points.at(-1)?.value)}`} />}</AsyncView>
            <AsyncView loaded={votes}>{({ elections: list }) => <Stat label="Registered voters" value={short(list[0]?.registeredVoters)} hint={tr("{} election", list[0]?.year)} />}</AsyncView>
            <AsyncView loaded={tend}>{(d) => <Stat label="Open tenders" value={n(d.summary.byStatus.find((x) => x.status === "open")?.count)} hint="Buyers asking for bids now" />}</AsyncView>
            <AsyncView loaded={board}>{(b) => <Stat label="Most projects per 100,000" value={b.rows[0]?.name ?? "—"} hint={`${n1(b.rows[0]?.value)} projects`} />}</AsyncView>
          </div>
        </Section>
        <div className="mt-6"><FactStrip /></div>
        {saved.places.length > 0 ? (
          <Section kicker="Close to you" title="Your places against the country">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{saved.places.slice(0, 3).map((p) => <Compare key={p.id} id={p.id} name={p.name} />)}</div>
          </Section>
        ) : null}
        <Section kicker={tr("Across {}", country)} title="Where people live">
          <AsyncView loaded={map}>{(m) => <StatMap data={m} height={400} />}</AsyncView>
          <p className="mt-2 text-xs text-content-muted">{tr("People per square kilometre in each county. Darker is more crowded.")} <Link className="underline" href="/statistics">{tr("More statistics →")}</Link></p>
        </Section>
        <AsyncView loaded={series}>{(s) => (<Section kicker="Growth" title="How the population has grown"><div className="glass card"><LineChart points={s.points} unit="people" label={tr("{} population over time", country)} /></div></Section>)}</AsyncView>
        <Section kicker="Keep exploring" title="More to look at">
          <ul className="flex flex-wrap gap-2">{MORE.map((m) => <li key={m.href}><Link href={m.href} className="btn btn-ghost"><Icon name={m.icon} size={18} />{tr(m.title)}</Link></li>)}</ul>
          <p className="mt-6 text-xs text-content-muted">{t("sampleNotice")}</p>
        </Section>
      </div>
    </div>
  );
}
