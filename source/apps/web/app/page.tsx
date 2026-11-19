/** Home: the visitor's context first the analytics, then what is coming (countdown and calendar), then a tip. A server page; the analytics below are the earlier client sections, kept whole. */
import { getCalendar } from "@mzizi/api-client/actions/experience/get-calendar.actions.ts";
import { listFacts } from "@mzizi/api-client/actions/experience/list-facts.actions.ts";

import { CalendarList } from "#/components/site/calendar-list.tsx";
import { CountdownCard } from "#/components/site/countdown-card.tsx";
import { FactsCarousel } from "#/components/site/facts-carousel.tsx";
import { HomeAnalytics } from "#/components/site/home-analytics.tsx";
import { loadContext, serverLanguage, unwrap } from "#/lib/server/data.ts";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [context, language] = [await loadContext(), await serverLanguage()];
  const placeId = context?.place?.featureId;
  const to = new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10);
  const [calendar, facts] = await Promise.all([
    unwrap(getCalendar({ query: { languageCode: language, to, featureId: placeId } })),
    unwrap(listFacts({ query: { featureId: placeId, limit: 12 } })),
  ]);
  const country = context?.country.name ?? "";
  return (
    <div>
      <HomeAnalytics country={country} />
      {calendar?.next || (calendar && calendar.events.length > 0) ? (
        <section className="mx-auto max-w-7xl space-y-5 px-5 pb-10" aria-label="Coming up">
          {calendar?.next ? <CountdownCard next={calendar.next} href={context?.place ? `/${context.place.path}/calendar` : "/calendar"} /> : null}
          {calendar && calendar.events.length > 0 ? <CalendarList events={calendar.events.slice(0, 6)} /> : null}
        </section>
      ) : null}
      <section className="mx-auto max-w-2xl px-5 pb-12" aria-label="Did you know?">
        <FactsCarousel facts={facts?.facts ?? []} scopeName={context?.place?.name ?? country} />
      </section>
    </div>
  );
}
