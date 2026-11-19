/** `/calendar/<yyyy-mm>`: one month of the calendar. A server page. */
import { notFound } from "next/navigation";

import { getCalendar } from "@mzizi/api-client/actions/experience/get-calendar.actions.ts";

import { CalendarList } from "#/components/site/calendar-list.tsx";
import { Breadcrumbs, PageFrame } from "#/components/site/ui/primitives.tsx";
import { serverLanguage, unwrap } from "#/lib/server/data.ts";

export const dynamic = "force-dynamic";

export default async function MonthRoute({ params }: { params: Promise<{ month: string }> }) {
  const { month } = await params;
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) notFound();
  const language = await serverLanguage();
  const [year, m] = month.split("-").map(Number) as [number, number];
  const last = new Date(year, m, 0).getDate();
  const calendar = await unwrap(getCalendar({ query: { languageCode: language, from: `${month}-01`, to: `${month}-${String(last).padStart(2, "0")}` } }));
  const label = new Date(year, m - 1, 1).toLocaleDateString("en", { month: "long", year: "numeric" });
  return (
    <PageFrame>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Calendar", href: "/calendar" }, { label }]} />
      <h1 className="hero-title text-4xl sm:text-5xl">{label}</h1>
      <div className="mt-6">
        {calendar && calendar.events.length > 0 ? <CalendarList events={calendar.events} /> : <p className="glass card text-content-muted">{calendar?.gaps[0] ?? "Nothing is recorded for this month."}</p>}
      </div>
    </PageFrame>
  );
}
