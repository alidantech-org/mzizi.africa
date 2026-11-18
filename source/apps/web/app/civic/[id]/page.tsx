"use client";

/** Route `/civic/<place>`: a place's fund and spending by year and class, its projects on a map, infrastructure coverage and leadership. */
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

import { AsyncView } from "#/components/site/async-view.tsx";
import { ProjectsMapLazy } from "#/components/site/map/projects-map-lazy.tsx";
import { ProjectCard } from "#/components/site/project-card.tsx";
import { BarList, Donut } from "#/components/site/ui/charts.tsx";
import { Avatar } from "#/components/site/ui/media.tsx";
import { Gaps, PageFrame, PlaceTabs, PlaceTrail, Section, Stat } from "#/components/site/ui/primitives.tsx";
import { ksh, n, n1, pct } from "#/lib/site/format.ts";
import { civicOf } from "#/lib/site/insights.ts";
import { useAsync } from "#/lib/site/use-async.ts";

const STATUSES = ["all", "completed", "ongoing", "planned"] as const;

export default function PlaceCivicRoute() {
  const { id } = useParams<{ id: string }>();
  const [status, setStatus] = useState<(typeof STATUSES)[number]>("all");
  const loaded = useAsync(() => civicOf(id), `civic-${id}`);
  return (
    <PageFrame wide>
      <AsyncView loaded={loaded}>
        {(d) => {
          const shown = d.projects.filter((p) => status === "all" || p.status === status);
          const pins = shown.filter((p) => p.location).map((p) => ({ code: p.code, name: p.name, status: p.status, location: p.location!, href: `/projects/${p.code}` }));
          const i = d.infrastructure;
          const classes = d.classes;
          return (
            <>
              <PlaceTrail chain={d.chain} section={{ label: "Money & projects", href: "/civic" }} />
              <PlaceTabs featureId={id} />
              <p className="kicker">{d.place.kindLabel} · money and projects</p>
              <h1 className="hero-title text-4xl sm:text-5xl">{d.place.name}</h1>
              {d.fund ? <p className="mt-2 text-content-muted">Development fund managed by {d.fund.managedBy ?? "its committee"}.</p> : null}
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Stat label="Latest allocation" value={ksh(d.years[0]?.total)} hint={d.years[0] ? `${d.years[0].year}` : "No year recorded"} />
                <Stat label="Projects recorded" value={n(i.projects)} hint={`${pct(i.completionRate, 0)} completed`} />
                <Stat label="Projects per 100,000 people" value={n1(i.per100k)} hint={i.population ? `${n(i.population)} residents` : undefined} />
                <Stat label="Projects per 1,000 km²" value={i.perKm2 !== null ? n1(i.perKm2 * 1000) : "—"} hint={i.areaKm2 ? `${n(i.areaKm2)} km²` : undefined} />
              </div>
              {classes.length > 0 ? (
                <Section kicker="Spending" title="What the money was for">
                  <div className="grid gap-4 lg:grid-cols-2">
                    <div className="glass card"><Donut label="Allocations by class" slices={classes.slice(0, 7).map((c) => ({ label: c.label, value: c.amount }))} center={ksh(classes.reduce((a, c) => a + c.amount, 0))} /></div>
                    <div className="glass card"><BarList items={classes.map((c) => ({ label: c.label, value: c.amount }))} format={ksh} />
                      <p className="mt-3 text-xs text-content-muted">Staff, running and committee costs take {pct(i.staffShare)} of allocations; infrastructure projects get about {pct(i.projectShare)}.</p></div>
                  </div>
                </Section>
              ) : null}
              {d.years.length > 0 ? (
                <Section kicker="Year by year" title="Allocations">
                  <div className="glass card overflow-x-auto"><table className="table-clean"><thead><tr><th>Year</th><th>Total</th><th>Biggest lines</th></tr></thead>
                    <tbody>{d.years.map((y) => <tr key={y.year}><td className="num font-semibold">{y.year}</td><td className="num">{ksh(y.total)}</td><td className="text-content-muted">{y.classes.slice(0, 3).map((c) => `${c.label} ${ksh(c.amount)}`).join(" · ")}</td></tr>)}</tbody></table></div>
                </Section>
              ) : null}
              <Section kicker="On the ground" title={`Projects (${shown.length})`} action={<div className="flex gap-1">{STATUSES.map((s) => <button key={s} className="tab" data-active={status === s} onClick={() => setStatus(s)}>{s === "all" ? "All" : s[0]!.toUpperCase() + s.slice(1)}</button>)}</div>}>
                {pins.length > 0 ? <ProjectsMapLazy pins={pins} /> : <p className="text-sm text-content-muted">No project here has a map location yet.</p>}
                <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{shown.slice(0, 24).map((p) => <li key={p.code}><ProjectCard p={p} /></li>)}</ul>
                {shown.length > 24 ? <p className="mt-3 text-sm text-content-muted">Showing 24 of {shown.length}.</p> : null}
              </Section>
              {d.leadership.length > 0 ? (
                <Section kicker="Responsible" title="Leadership here">
                  <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">{d.leadership.slice(0, 9).map((o) => (
                    <li key={o.holderId} className="min-w-0"><Link href={`/leaders/${o.holderId}`} className="glass card card-lift flex min-w-0 items-center gap-3 !py-3"><Avatar name={o.personName} size={44} /><span className="min-w-0"><span className="block truncate font-semibold">{o.personName}</span><span className="block truncate text-xs text-content-muted">{o.officeTitle}{o.partyName ? ` · ${o.partyName}` : ""}</span></span></Link></li>
                  ))}</ul>
                </Section>
              ) : null}
              <Gaps items={d.gaps} topic={`money and projects in ${d.place.name}`} />
            </>
          );
        }}
      </AsyncView>
    </PageFrame>
  );
}
