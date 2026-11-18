/** Home: the visitor's context first (countdown, a tip, what is coming), then the analytics. A server page; the analytics below are the earlier client sections, kept whole. */
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
      <div className="mx-auto grid max-w-7xl gap-5 px-5 pt-6 lg:grid-cols-[1.4fr_1fr]">
        {calendar?.next ? <CountdownCard next={calendar.next} href={context?.place ? `/${context.place.path}/calendar` : "/calendar"} /> : null}
        <div className="space-y-5">
          <FactsCarousel facts={facts?.facts ?? []} scopeName={context?.place?.name ?? country} />
          {calendar && calendar.events.length > 0 ? <CalendarList events={calendar.events.slice(0, 4)} /> : null}
        </div>
      </div>
      <HomeAnalytics country={country} />
    </div>
  );
}
