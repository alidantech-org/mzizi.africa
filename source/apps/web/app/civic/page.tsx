"use client";

/** Route `/civic`: money and projects. Pick a county or constituency to see its fund, spending and works; or rank them. */
import Link from "next/link";

import { AsyncView } from "#/components/site/async-view.tsx";
import { Breadcrumbs, PageFrame, Section } from "#/components/site/ui/primitives.tsx";
import { n1, short } from "#/lib/site/format.ts";
import { ProjectsMapLazy } from "#/components/site/map/projects-map-lazy.tsx";
import { ProjectCard } from "#/components/site/project-card.tsx";
import { Gaps } from "#/components/site/ui/primitives.tsx";
import { boardOf, nearbyOf, type NearbyProject } from "#/lib/site/insights.ts";
import { useState } from "react";
import { useAsync } from "#/lib/site/use-async.ts";

function Mini({ metric, title, kind }: { metric: string; title: string; kind: string }) {
  const loaded = useAsync(() => boardOf(metric, kind, undefined, 8), `civic-${metric}`);
  return (
    <div className="glass card">
      <div className="mb-3 flex items-center justify-between"><h3 className="font-display text-xl">{title}</h3><Link className="text-sm text-clay" href={`/leaderboards?metric=${metric}&kind=${kind}`}>Full ranking →</Link></div>
      <AsyncView loaded={loaded}>
        {(b) => (
          <ol className="space-y-1.5">{b.rows.map((r) => (
            <li key={r.rank}><Link href={`/civic/${r.featureId}`} className="grid grid-cols-[1.5rem_1fr_auto] items-center gap-2 rounded-xl px-2 py-1.5 text-sm hover:bg-surface-sunken"><span className="num text-xs text-content-muted">{r.rank}</span><span className="truncate">{r.name}</span><span className="num font-semibold">{r.value > 9999 ? short(r.value) : n1(r.value)}{b.metric.unit === "%" ? "%" : ""}</span></Link></li>
          ))}</ol>
        )}
      </AsyncView>
    </div>
  );
}

function NearYou() {
  const [state, setState] = useState<{ phase: "idle" | "locating" | "done" | "error"; projects: NearbyProject[]; gaps: string[]; message: string }>({ phase: "idle", projects: [], gaps: [], message: "" });
  const locate = () => {
    setState((s) => ({ ...s, phase: "locating" }));
    navigator.geolocation.getCurrentPosition(
      (pos) => nearbyOf(pos.coords.latitude, pos.coords.longitude, 15).then((r) => setState({ phase: "done", projects: r.projects, gaps: r.gaps, message: "" }), (e: Error) => setState((s) => ({ ...s, phase: "error", message: e.message }))),
      () => setState((s) => ({ ...s, phase: "error", message: "We could not read your location. Browse to your area instead." })),
    );
  };
  return (
    <Section kicker="Near you" title="Projects around your position">
      <button className="btn btn-primary" onClick={locate} disabled={state.phase === "locating"}>{state.phase === "locating" ? "Finding you…" : "📍 Show projects near me"}</button>
      {state.phase === "error" ? <p role="alert" className="mt-3 text-sm text-danger">{state.message}</p> : null}
      {state.phase === "done" ? (
        <>
          <div className="mt-4"><ProjectsMapLazy height={320} pins={state.projects.filter((p) => p.location).map((p) => ({ code: p.code, name: p.name, status: p.status, location: p.location!, href: `/projects/${p.code}` }))} /></div>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{state.projects.slice(0, 8).map((p) => <li key={p.code}><ProjectCard p={{ ...p, started_on: null, completed_on: null, unit_id: "" }} /><p className="mt-1 text-xs text-content-muted">{p.distance_km.toFixed(1)} km away{p.responsible ? ` · ${p.responsible}` : ""}</p></li>)}</ul>
          <Gaps items={state.gaps} topic="projects near me" />
        </>
      ) : null}
    </Section>
  );
}

export default function CivicRoute() {
  return (
    <PageFrame wide>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Money & projects" }]} />
      <p className="kicker">Where the money goes</p>
      <h1 className="hero-title text-4xl sm:text-5xl">Money &amp; projects</h1>
      <p className="mt-2 max-w-2xl text-content-muted">Development fund allocations, what they were spent on, and the schools, roads and clinics built — mapped, with the people responsible and the evidence.</p>
      <p className="mt-4"><Link className="btn btn-primary" href="/browse">Find your area →</Link> <Link className="btn btn-ghost ml-2" href="/tenders">See tenders</Link></p>
      <Section kicker="Highlights" title="Who delivers the most">
        <div className="grid gap-4 lg:grid-cols-3">
          <Mini metric="civ.projects.per-100k" title="Projects per 100,000 people" kind="constituency" />
          <Mini metric="fin.ngcdf.project-share" title="Fund that reaches projects" kind="constituency" />
          <Mini metric="civ.projects.completion-rate" title="Projects completed" kind="constituency" />
        </div>
      </Section>
      <NearYou />
    </PageFrame>
  );
}
