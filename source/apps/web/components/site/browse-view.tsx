"use client";

/** The hierarchy one level at a time, in the order the electoral commission lists it: country, county, constituency, ward, then towns and villages. */
import Link from "next/link";
import { useMemo, useState } from "react";

import { AsyncView } from "#/components/site/async-view.tsx";
import { Gaps, PageFrame, PlaceTabs, PlaceTrail } from "#/components/site/ui/primitives.tsx";
import { n, short } from "#/lib/site/format.ts";
import { browse } from "#/lib/site/insights.ts";
import { useAsync } from "#/lib/site/use-async.ts";

const NEXT: Record<string, string> = { country: "counties", county: "constituencies and towns", constituency: "wards", ward: "towns and villages", town: "villages", city: "neighbourhoods" };

export function BrowseView({ featureId }: { featureId?: string }) {
  const loaded = useAsync(() => browse(featureId), `browse-${featureId ?? "root"}`);
  const [filter, setFilter] = useState("");
  return (
    <PageFrame>
      <AsyncView loaded={loaded}>
        {(data) => <Body data={data} featureId={featureId} filter={filter} setFilter={setFilter} />}
      </AsyncView>
    </PageFrame>
  );
}

function Body({ data, featureId, filter, setFilter }: { data: Awaited<ReturnType<typeof browse>>; featureId?: string; filter: string; setFilter: (v: string) => void }) {
  const kind = data.place?.kindCode.replace(/^.*\./, "") ?? "country";
  const kids = useMemo(() => data.children.filter((c) => c.name.toLowerCase().includes(filter.toLowerCase())), [data, filter]);
  const groups = useMemo(() => {
    const map = new Map<string, typeof kids>();
    for (const k of kids) map.set(k.kindLabel, [...(map.get(k.kindLabel) ?? []), k]);
    return [...map.entries()];
  }, [kids]);
  return (
    <>
      <PlaceTrail chain={data.chain} section={{ label: "Places", href: "/browse" }} />
      {featureId && data.place ? <PlaceTabs featureId={featureId} /> : null}
      <p className="kicker">{data.place?.kindLabel ?? "Country"}</p>
      <h1 className="hero-title text-4xl sm:text-5xl">{data.place?.name ?? "Kenya"}</h1>
      <p className="mt-2 max-w-2xl text-content-muted">
        {data.children.length > 0 ? `${data.children.length} ${NEXT[kind] ?? "places"} inside. Choose one to go deeper, or open its statistics, elections and money.` : "This is the smallest place recorded here. Open its profile to see who serves it."}
      </p>
      {data.place && featureId ? <p className="mt-4"><Link className="btn btn-primary" href={`/place-profile?featureId=${featureId}`}>Who serves {data.place.name} →</Link></p> : null}
      {data.children.length > 8 ? (
        <label className="glass mt-6 flex max-w-sm items-center gap-2 rounded-full px-4 py-2"><span aria-hidden>🔎</span>
          <input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Filter this list" className="min-w-0 flex-1 bg-transparent text-sm outline-none" aria-label="Filter this list" />
        </label>
      ) : null}
      {groups.map(([label, list]) => (
        <section key={label} className="mt-8">
          <h2 className="mb-3 font-display text-xl text-content-muted">{label}s <span className="num text-base">· {list.length}</span></h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((child) => (
              <li key={child.featureId}>
                <Link href={child.childCount > 0 ? `/browse/${child.featureId}` : `/place-profile?featureId=${child.featureId}`} className="glass card card-lift flex items-center justify-between gap-3">
                  <span className="min-w-0">
                    <span className="block truncate font-display text-lg">{child.name}</span>
                    <span className="text-xs text-content-muted">{child.kindLabel}{child.childCount > 0 ? ` · ${n(child.childCount)} inside` : ""}</span>
                  </span>
                  <span className="shrink-0 text-right">
                    <span className="num block text-sm font-semibold">{short(child.population)}</span>
                    <span className="text-[10px] uppercase tracking-wide text-content-muted">people</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
      {data.children.length === 0 ? <Gaps topic={`places inside ${data.place?.name ?? "Kenya"}`} items={[`No smaller places are recorded inside ${data.place?.name ?? "this place"} yet. Towns and villages are added where a source names them.`]} /> : null}
    </>
  );
}
