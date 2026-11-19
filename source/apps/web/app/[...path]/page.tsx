/**
 * A place by its clean address (`/nairobi/westlands`) and, under it, a section (`/nairobi/westlands/infrastructure`).
 * The address is resolved on the server through the slug registry; anything that is not a known place is a 404.
 */
import Link from "next/link";
import { notFound } from "next/navigation";

import { getCalendar } from "@mzizi/api-client/actions/experience/get-calendar.actions.ts";
import { listFacilities } from "@mzizi/api-client/actions/experience/list-facilities.actions.ts";

import { CalendarList } from "#/components/site/calendar-list.tsx";
import { CountdownCard } from "#/components/site/countdown-card.tsx";
import { FacilitiesPage } from "#/components/site/facilities-page.tsx";
import { ClassChips } from "#/components/site/facility-views.tsx";
import { PlaceCompare, PlaceElections, PlaceFinance, PlaceLeaders, PlaceStatistics } from "#/components/site/views/index.ts";
import { BrowsePage } from "#/components/site/views/browse-page.tsx";
import { PageFrame } from "#/components/site/ui/primitives.tsx";
import { loadContext, serverLanguage, unwrap } from "#/lib/server/data.ts";

export const dynamic = "force-dynamic";

export default async function PlacePage({ params, searchParams }: { params: Promise<{ path: string[] }>; searchParams: Promise<{ class?: string; q?: string }> }) {
  const { path } = await params;
  const query = await searchParams;
  const context = await loadContext(path.join("/"));
  const place = context?.place;
  if (!context || !place) notFound();
  const language = await serverLanguage();
  const section = context.rest.join("/");
  const id = place.featureId;
  if (section === "data/statistics") return <PlaceStatistics id={id} />;
  if (section === "finance") return <PlaceFinance id={id} />;
  if (section === "elections") return <PlaceElections id={id} />;
  if (section === "places") return <BrowsePage featureId={id} />;
  if (section === "leaders") return <PlaceLeaders id={id} />;
  if (section === "data/compare") return <PlaceCompare id={id} />;
  if (section === "infrastructure") {
    const list = await unwrap(listFacilities({ query: { featureId: place.featureId, classCode: query.class, query: query.q, languageCode: language, limit: 60 } }));
    return <FacilitiesPage list={list} classCode={query.class} q={query.q} base={`/${place.path}/infrastructure`} />;
  }
  if (section === "calendar") {
    const calendar = await unwrap(getCalendar({ query: { featureId: place.featureId, languageCode: language, to: `${new Date().getFullYear() + 1}-12-31` } }));
    return (
      <PageFrame>
        <p className="kicker">{place.name}</p>
        <h1 className="hero-title text-4xl sm:text-5xl">Calendar</h1>
        <div className="mt-6 space-y-6">
          {calendar?.next ? <CountdownCard next={calendar.next} href={`/${place.path}/calendar`} /> : null}
          {calendar && calendar.events.length > 0 ? <CalendarList events={calendar.events} /> : <p className="glass card text-content-muted">{calendar?.gaps[0] ?? "No events are recorded for this place."}</p>}
        </div>
      </PageFrame>
    );
  }
  if (section) notFound();
  const [facilities, calendar] = await Promise.all([
    unwrap(listFacilities({ query: { featureId: place.featureId, languageCode: language, limit: 1 } })),
    unwrap(getCalendar({ query: { featureId: place.featureId, languageCode: language, to: `${new Date().getFullYear() + 1}-12-31` } })),
  ]);
  const tiles: { href: string; title: string; text: string }[] = [
    { href: `/${place.path}/infrastructure`, title: "Infrastructure", text: facilities ? `${new Intl.NumberFormat("en").format(facilities.total)} offices, schools, hospitals and stations recorded here` : "Offices, schools, hospitals and polling stations" },
    { href: `/${place.path}/data/statistics`, title: "Numbers", text: "Population, education, health and more, compared with the country" },
    { href: `/${place.path}/leaders`, title: "Leaders", text: "Who holds office here and above" },
    { href: `/${place.path}/elections`, title: "Elections", text: "Results, turnout and registered voters over the years" },
    { href: `/${place.path}/finance`, title: "Money and projects", text: "Funds, spending and projects" },
    { href: `/${place.path}/calendar`, title: "Calendar", text: "Dates that matter here" },
  ];
  return (
    <PageFrame>
      <p className="kicker">{place.kindLabel}</p>
      <h1 className="hero-title text-4xl sm:text-6xl">{place.name}</h1>
      <p className="mt-2 text-content-muted">{context.chain.slice(0, -1).map((unit) => unit.name).join(" · ") || context.country.name}</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {tiles.map((tile) => (
          <Link key={tile.title} href={tile.href} className="glass card card-lift block">
            <h2 className="font-display text-xl">{tile.title}</h2>
            <p className="mt-1 text-sm text-content-muted">{tile.text}</p>
          </Link>
        ))}
      </div>
      {facilities && facilities.classes.length > 0 ? <div className="mt-6"><ClassChips classes={facilities.classes} base={`/${place.path}/infrastructure`} /></div> : null}
      <div className="mt-6 space-y-5">
        {calendar?.next ? <CountdownCard next={calendar.next} href={`/${place.path}/calendar`} /> : null}
        {calendar && calendar.events.length > 0 ? <CalendarList events={calendar.events.slice(0, 5)} /> : null}
      </div>
    </PageFrame>
  );
}
