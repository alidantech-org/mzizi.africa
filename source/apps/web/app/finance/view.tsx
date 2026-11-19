"use client";

/** Route `/finance`: money and projects. Pick a county or constituency to see its fund, spending and works; or rank them. */
import Link from "next/link";
import { placeAt } from "#/lib/site/links.ts";
import { T } from "#/lib/site/i18n.tsx";

import { AsyncView } from "#/components/site/async-view.tsx";
import { Breadcrumbs, PageFrame, Section } from "#/components/site/ui/primitives.tsx";
import { n1, short } from "#/lib/site/format.ts";
import { Icon } from "#/components/brand/icon.tsx";
import { ProjectsMapLazy } from "#/components/site/map/projects-map-lazy.tsx";
import { ProjectCard } from "#/components/site/project-card.tsx";
import { Gaps } from "#/components/site/ui/primitives.tsx";
import { boardOf, metrics, nearbyOf, type NearbyProject } from "#/lib/site/insights.ts";
import { useEffect, useState } from "react";
import { useAsync } from "#/lib/site/use-async.ts";

/** The first rankings of the delivery and finance domains, as the API lists them. */
function Highlights() {
  const list = useAsync(() => metrics(), "highlight-metrics");
  if (list.state !== "ready") return null;
  const shown = list.value.metrics.filter((m) => m.domain === "civic" || m.domain === "finance").slice(0, 3);
  return <>{shown.map((m) => <Mini key={m.code} metric={m.code} title={m.title} kind="constituency" />)}</>;
}

function Mini({ metric, title, kind }: { metric: string; title: string; kind: string }) {
  const loaded = useAsync(() => boardOf(metric, kind, undefined, 8), `civic-${metric}`);
  return (
    <div className="glass card">
      <div className="mb-3 flex items-center justify-between"><h3 className="font-display text-xl">{title}</h3><Link className="text-sm text-clay" href={`/data/rankings?metric=${metric}&kind=${kind}`}>Full ranking →</Link></div>
      <AsyncView loaded={loaded}>
        {(b) => (
          <ol className="space-y-1.5">{b.rows.map((r) => (
            <li key={r.rank}><Link href={placeAt(r.path, "finance")} className="grid grid-cols-[1.5rem_1fr_auto] items-center gap-2 rounded-xl px-2 py-1.5 text-sm hover:bg-surface-sunken"><span className="num text-xs text-content-muted">{r.rank}</span><span className="truncate">{r.name}</span><span className="num font-semibold">{r.value > 9999 ? short(r.value) : n1(r.value)}{b.metric.unit === "%" ? "%" : ""}</span></Link></li>
          ))}</ol>
        )}
      </AsyncView>
    </div>
  );
}

function NearYou() {
  const [state, setState] = useState<{ phase: "idle" | "locating" | "done" | "error"; projects: NearbyProject[]; gaps: string[]; message: string; at: string }>({ phase: "idle", projects: [], gaps: [], message: "", at: "" });
  const [typed, setTyped] = useState("");
  const load = (lat: number, lng: number) => {
    setState((s) => ({ ...s, phase: "locating", at: `${lat.toFixed(4)}, ${lng.toFixed(4)}` }));
    nearbyOf(lat, lng, 15).then(
      (r) => setState((s) => ({ ...s, phase: "done", projects: r.projects, gaps: r.gaps, message: "" })),
      (e: Error) => setState((s) => ({ ...s, phase: "error", message: e.message })),
    );
  };
  const locate = () => {
    setState((s) => ({ ...s, phase: "locating" }));
    if (!("geolocation" in navigator)) return setState((s) => ({ ...s, phase: "error", message: "This browser cannot share a position. Type coordinates below instead." }));
    navigator.geolocation.getCurrentPosition(
      (pos) => load(pos.coords.latitude, pos.coords.longitude),
      () => setState((s) => ({ ...s, phase: "error", message: "We could not read your location. Type a position below, or browse to your area." })),
      { timeout: 10000 },
    );
  };
  // A link such as /civic?lat=-1.2676&lng=36.8108 shows the projects around that position without asking the browser.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const lat = Number(q.get("lat")), lng = Number(q.get("lng"));
    if (q.has("lat") && q.has("lng") && Number.isFinite(lat) && Number.isFinite(lng)) load(lat, lng);
  }, []);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const [a, b] = typed.split(/[ ,;]+/).map(Number);
    if (typed.trim() === "" || !Number.isFinite(a) || !Number.isFinite(b) || Math.abs(a!) > 90 || Math.abs(b!) > 180) return setState((s) => ({ ...s, phase: "error", message: "Type a latitude and a longitude, for example -1.2676, 36.8108." }));
    load(a!, b!);
  };
  return (
    <Section kicker="Near you" title="Projects around your position">
      <div className="flex flex-wrap items-center gap-3">
        <button className="btn btn-primary" onClick={locate} disabled={state.phase === "locating"}>{state.phase === "locating" ? "Finding you…" : <><Icon name="locate" size={18} /> Show projects near me</>}</button>
        <form onSubmit={submit} className="flex items-center gap-2">
          <label className="sr-only" htmlFor="pos">Latitude and longitude</label>
          <input id="pos" value={typed} onChange={(e) => setTyped(e.target.value)} placeholder="Or type a position: -1.2676, 36.8108" className="glass h-10 w-72 rounded-full px-4 text-sm" />
          <button className="btn btn-ghost" type="submit">Go</button>
        </form>
      </div>
      {state.phase === "error" ? <p role="alert" className="mt-3 text-sm text-danger">{state.message}</p> : null}
      {state.phase === "done" ? (
        <>
          <p className="mt-3 text-sm text-content-muted">Within 15 km of {state.at || "you"}: {state.projects.length} project{state.projects.length === 1 ? "" : "s"}.</p>
          <div className="mt-4"><ProjectsMapLazy height={320} pins={state.projects.filter((p) => p.location).map((p) => ({ code: p.code, name: p.name, status: p.status, location: p.location!, href: `/projects/${p.code}` }))} /></div>
          <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">{state.projects.slice(0, 8).map((p) => <li key={p.code} className="min-w-0"><ProjectCard p={{ ...p, started_on: null, completed_on: null, unit_id: "" }} /><p className="mt-1 text-xs text-content-muted">{p.distance_km.toFixed(1)} km away{p.responsible ? ` · ${p.responsible}` : ""}</p></li>)}</ul>
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
      <h1 className="hero-title text-4xl sm:text-5xl"><T>{"Money & projects"}</T></h1>
      <p className="mt-2 max-w-2xl text-content-muted"><T>{"Development fund allocations, what they were spent on, and the schools, roads and clinics built — mapped, with the people responsible and the evidence."}</T></p>
      <p className="mt-4"><Link className="btn btn-primary" href="/places"><T>Find your area →</T></Link> <Link className="btn btn-ghost ml-2" href="/procurement/tenders"><T>See tenders</T></Link></p>
      <Section kicker="Highlights" title="Who delivers the most">
        <div className="grid gap-4 lg:grid-cols-3">
          <Highlights />
        </div>
      </Section>
      <NearYou />
    </PageFrame>
  );
}
