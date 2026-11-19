import Link from "next/link";

import type { ExperienceCalendarEvent } from "@mzizi/api-client/types/experience/calendar-event.ts";

const day = (iso: string) => new Date(`${iso}T00:00:00`);

/** Events grouped by month. A moved date shows the date it was planned for and why it changed. */
export function CalendarList({ events }: { events: readonly ExperienceCalendarEvent[] }) {
  const months = new Map<string, ExperienceCalendarEvent[]>();
  for (const event of events) {
    const key = event.plannedOn.slice(0, 7);
    months.set(key, [...(months.get(key) ?? []), event]);
  }
  return (
    <div className="space-y-6">
      {[...months.entries()].map(([key, list]) => (
        <section key={key} aria-labelledby={`m-${key}`}>
          <h2 id={`m-${key}`} className="font-display text-xl">{day(`${key}-01`).toLocaleDateString("en", { month: "long", year: "numeric" })}</h2>
          <ul className="mt-2 divide-y divide-[var(--border-default)] glass rounded-2xl">
            {list.map((event) => {
              const moved = event.actualOn && event.actualOn !== event.plannedOn;
              const shown = day(event.actualOn ?? event.plannedOn);
              return (
                <li key={event.occurrenceCode} className="flex items-start gap-4 px-4 py-3">
                  <div className="w-12 shrink-0 text-center">
                    <p className="num font-display text-2xl leading-none">{shown.getDate()}</p>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-content-muted">{shown.toLocaleDateString("en", { weekday: "short" })}</p>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold"><Link className="hover:underline" href={`/events/${event.eventCode}`}>{event.name}</Link></p>
                    <p className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-content-muted">
                      <span className="chip">{event.kindLabel}</span>
                      <span className="chip">{event.knowledgeLabel}</span>
                      {event.statusCode !== "scheduled" && event.statusCode !== "held" ? <span className="chip">{event.statusLabel}</span> : null}
                      {event.venueCount > 0 ? <span>{event.venueCount} places</span> : null}
                    </p>
                    {moved ? <p className="mt-1 text-xs text-content-muted">Planned for {day(event.plannedOn).toLocaleDateString("en", { day: "numeric", month: "long" })}{event.changeReason ? `; moved because it ${event.changeReason.toLowerCase()}` : ""}.</p> : null}
                  </div>
                  <p className="num hidden shrink-0 text-xs text-content-muted sm:block">{event.daysAway === 0 ? "Today" : event.daysAway > 0 ? `in ${event.daysAway} days` : `${-event.daysAway} days ago`}</p>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
