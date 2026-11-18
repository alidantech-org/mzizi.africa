"use client";

import { DidYouKnow } from "#/components/site/ui/hint.tsx";
import { facts } from "#/lib/site/insights.ts";
import { useAsync } from "#/lib/site/use-async.ts";

/** One "Did you know?" fact, picked for the day and, when a place is given, tagged to it or to the country. */
export function FactStrip({ featureId }: { featureId?: string }) {
  const loaded = useAsync(() => facts(featureId), `facts-${featureId ?? "all"}`);
  if (loaded.state !== "ready" || loaded.value.facts.length === 0) return null;
  const list = loaded.value.facts;
  const pick = list[new Date().getDate() % list.length]!;
  return (
    <DidYouKnow>
      <p className="font-semibold">{pick.statement}</p>
      {pick.detail ? <p className="mt-1 text-content-muted">{pick.detail}</p> : null}
      <p className="mt-1 text-xs text-content-muted">{pick.place ? `About ${pick.place}` : "About Kenya"}{pick.source ? ` · ${pick.source}` : ""}</p>
    </DidYouKnow>
  );
}
