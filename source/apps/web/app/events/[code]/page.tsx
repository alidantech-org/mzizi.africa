/** `/events/<code>`: one event with every date it has been planned for and held. A server page. */
import { notFound } from "next/navigation";

import { getCalendar } from "@mzizi/api-client/actions/experience/get-calendar.actions.ts";

import { CalendarList } from "#/components/site/calendar-list.tsx";
import { Breadcrumbs, PageFrame } from "#/components/site/ui/primitives.tsx";
import { serverLanguage, unwrap } from "#/lib/server/data.ts";

export const dynamic = "force-dynamic";

export default async function EventRoute({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const language = await serverLanguage();
  const year = new Date().getFullYear();
  const calendar = await unwrap(getCalendar({ query: { languageCode: language, from: `${year - 10}-01-01`, to: `${year + 10}-12-31` } }));
  const occurrences = (calendar?.events ?? []).filter((e) => e.eventCode === decodeURIComponent(code));
  const first = occurrences[0];
  if (!first) notFound();
  return (
    <PageFrame>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Calendar", href: "/calendar" }, { label: first.name }]} />
      <p className="kicker">{first.kindLabel}</p>
      <h1 className="hero-title text-4xl sm:text-5xl">{first.name}</h1>
      <div className="mt-6"><CalendarList events={occurrences} /></div>
    </PageFrame>
  );
}
