/** One page of the app for a place: the subject in `?view=` (home by default) of the place named by the address. */
import { copy } from "@mzizi/copy";
import { Suspense } from "react";
import { PageSkeleton } from "#/components/ui/skeleton";
import PlaceGovernment from "#/app/(app)/_views/place-government";
import PlaceMoney from "#/app/(app)/_views/place-money";
import PlaceStatistics from "#/app/(app)/_views/place-statistics";
import PlaceHome from "#/app/(app)/_views/place-home";
import PlaceSources from "#/app/(app)/_views/place-sources";
import Link from "#/components/navigation/demo-link";
import { PageHeader } from "#/components/ui/page-header";
import { isView, VIEWS, type ViewId } from "#/lib/navigation/route";
import { effectiveLanguage, getCopy } from "#/lib/server/copy";

type Params = Promise<{ country: string; place?: string[] }>;
type Query = Promise<Record<string, string | string[] | undefined>>;

/** The page itself touches no request data: everything dynamic is read inside one boundary, so the frame paints at once. */
export default function PlacePage({ params, searchParams }: { params: Params; searchParams: Query }) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <PlaceContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}

async function PlaceContent({
  params,
  searchParams,
}: {
  params: Promise<{ country: string; place?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ country, place = [] }, query, language] = await Promise.all([params, searchParams, effectiveLanguage()]);
  const raw = Array.isArray(query.view) ? query.view[0] : query.view;
  const view: ViewId = raw && isView(raw) ? raw : "overview";
  const address = { country, trail: place.map((s) => decodeURIComponent(s)) };
  const base = `/${[country, ...place].join("/")}`;
  if (view === "overview") return <PlaceHome address={address} language={language} />;
  if (view === "statistics" || view === "compare") {
    const topic = Array.isArray(query.topic) ? query.topic[0] : query.topic;
    const indicator = Array.isArray(query["view.indicator"]) ? query["view.indicator"][0] : query["view.indicator"];
    return <PlaceStatistics address={address} language={language} topic={topic} indicator={indicator} />;
  }
  if (view === "finance" || view === "suppliers") return <PlaceMoney view={view} address={address} language={language} />;
  if (view === "sources") return <PlaceSources />;
  const id = Array.isArray(query["view.id"]) ? query["view.id"][0] : query["view.id"];
  if (view === "leaders" || view === "institutions" || view === "arms" || view === "law" || view === "parliament" || view === "elections" || view === "power")
    return <PlaceGovernment view={view} address={address} base={base} language={language} code={view === "institutions" ? id : undefined} />;

  return <PlaceHome address={address} language={language} />;
}
