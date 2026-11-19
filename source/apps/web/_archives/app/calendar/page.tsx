/** Calendar: public holidays, elections and their timetable, with how each date is known and whether it moved. */
import { getCalendar } from "@mzizi/api-client/actions/experience/get-calendar.actions.ts";

import { CalendarList } from "#/_archives/components/site/calendar-list";
import { CountdownCard } from "#/_archives/components/site/countdown-card";
import { PageFrame } from "#/_archives/components/site/ui/primitives";
import { serverLanguage, unwrap } from "#/_archives/lib/server/data";

export const dynamic = "force-dynamic";

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; featureId?: string }>;
}) {
  const { year, featureId } = await searchParams;
  const y = Number(year) || new Date().getFullYear();
  const calendar = await unwrap(
    getCalendar({
      query: {
        languageCode: await serverLanguage(),
        from: `${y}-01-01`,
        to: `${y}-12-31`,
        featureId,
      },
    }),
  );
  return (
    <PageFrame>
      <p className="kicker">Calendar</p>
      <h1 className="hero-title text-4xl sm:text-5xl">{y}</h1>
      <nav className="mt-3 flex gap-2" aria-label="Year">
        {[y - 1, y, y + 1].map((value) => (
          <a
            key={value}
            href={`/calendar?year=${value}`}
            className="tab"
            data-active={value === y}
          >
            {value}
          </a>
        ))}
      </nav>
      <div className="mt-6 space-y-6">
        {calendar?.next ? (
          <CountdownCard next={calendar.next} href="/calendar" />
        ) : null}
        {calendar && calendar.events.length > 0 ? (
          <CalendarList events={calendar.events} />
        ) : (
          <p className="glass card text-content-muted">
            {calendar?.gaps[0] ?? "The calendar could not be loaded."}
          </p>
        )}
      </div>
    </PageFrame>
  );
}
