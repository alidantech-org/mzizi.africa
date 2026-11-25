/**
 * The overview of a place: what it is, where it sits, its divisions on a map, headline figures, who holds its offices,
 * projects, upcoming civic events and articles. One server read (`frontend/place`); the map streams in on its own.
 */
import { Building2, CalendarDays, ChartColumn, Hammer, Map as MapIcon, Newspaper, Users } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { Panel } from "#/components/ui/panel";
import { PageHeader } from "#/components/ui/page-header";
import { SkeletonPanel } from "#/components/ui/skeleton";
import { hrefOf, type PlaceAddress } from "#/lib/server/codes";
import { loadPlace } from "#/lib/server/views/place-home";
import PlaceMap from "#/app/(app)/_views/place-map";
import { formatValue, Text } from "#/app/(app)/_views/text";

/** Headline figures shown on the overview; the statistics view lists all. */
const HEADLINE = 8;

export default async function PlaceHome({ address, language }: { address: PlaceAddress; language: string }) {
  const { data, failed } = await loadPlace(address, language);
  if (!data)
    return (
      <PageHeader eyebrow="Place" title={failed ? "This place could not be loaded" : "Place not found"}>
        Check the address, or choose a place from the list.
      </PageHeader>
    );
  const eyebrow = data.breadcrumb.length ? data.breadcrumb.map((b) => b.name.text).join(" › ") : "Country";
  return (
    <div className="grid gap-6">
      <PageHeader eyebrow={eyebrow} title={data.place.name.text}>
        {data.children.length > 0 ? `${data.children.length} divisions` : "No divisions recorded"} · {data.figures.length} figures ·{" "}
        {data.leaders.length} offices
      </PageHeader>
      <nav aria-label="Breadcrumb" className="flex flex-wrap gap-2 text-sm">
        {data.breadcrumb.map((b) => (
          <Link key={b.code} href={hrefOf(b.code)} className="text-accent hover:underline">
            <Text value={b.name} />
          </Link>
        ))}
      </nav>
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel id="map" title="Map" icon={MapIcon} note={`${data.children.length} divisions`}>
          <Suspense fallback={<SkeletonPanel height={320} />}>
            <PlaceMap parentId={data.place.id} label={`Divisions of ${data.place.name.text}`} />
          </Suspense>
        </Panel>
        <Panel id="divisions" title="Divisions" icon={Building2}>
          {data.children.length === 0 ? (
            <p className="text-sm text-muted">No divisions are recorded for this place.</p>
          ) : (
            <ul className="grid max-h-80 grid-cols-2 gap-x-4 gap-y-1 overflow-auto text-sm">
              {data.children.map((c) => (
                <li key={c.code}>
                  <Link href={hrefOf(c.code)} className="hover:underline">
                    <Text value={c.name} showFallbackIcon={c.name.isFallback} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
      <Panel id="figures" title="Figures" icon={ChartColumn} note="latest published">
        {data.figures.length === 0 ? (
          <p className="text-sm text-muted">No figures are recorded for this place yet.</p>
        ) : (
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {data.figures.slice(0, HEADLINE).map((f) => (
              <div key={f.indicator} className="rounded-md border border-line p-3">
                <dt className="truncate font-mono text-[11px] uppercase tracking-widest text-muted">
                  <Text value={f.label} />
                </dt>
                <dd className="mt-2 font-display text-2xl">
                  {formatValue(f.value, f.decimals, language)}
                  {f.unit && <span className="ml-1 text-sm text-muted">{f.unit}</span>}
                </dd>
                <dd className="text-xs text-muted">
                  {f.fromYear}
                  {f.status !== "final" && ` · ${f.status}`}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </Panel>
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel id="leaders" title="Leaders" icon={Users} note={`${data.leaders.length} offices`}>
          {data.leaders.length === 0 ? (
            <p className="text-sm text-muted">No offices are recorded for this place.</p>
          ) : (
            <ul className="grid gap-2 text-sm">
              {data.leaders.map((l) => (
                <li key={l.office} className="flex justify-between gap-4">
                  <Text value={l.officeName} />
                  <span className="text-muted">{l.personName ? <Text value={l.personName} /> : "vacant or not recorded"}</span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
        <Panel id="projects" title="Projects" icon={Hammer}>
          {data.projects.length === 0 ? (
            <p className="text-sm text-muted">No projects are recorded here yet.</p>
          ) : (
            <ul className="grid gap-1 text-sm">
              {data.projects.map((p) => (
                <li key={p.code}>
                  <Text value={p.name} />
                </li>
              ))}
            </ul>
          )}
        </Panel>
        <Panel id="events" title="Coming up" icon={CalendarDays}>
          {data.events.length === 0 ? (
            <p className="text-sm text-muted">No civic events are scheduled.</p>
          ) : (
            <ul className="grid gap-1 text-sm">
              {data.events.map((e) => (
                <li key={`${e.code}-${e.startsOn}`}>
                  {e.startsOn} · <Text value={e.name} />
                </li>
              ))}
            </ul>
          )}
        </Panel>
        <Panel id="articles" title="Articles" icon={Newspaper}>
          {data.articles.length === 0 ? (
            <p className="text-sm text-muted">No articles are written about this place yet.</p>
          ) : (
            <ul className="grid gap-1 text-sm">
              {data.articles.map((a) => (
                <li key={a.code}>
                  <Text value={a.title} />
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  );
}
