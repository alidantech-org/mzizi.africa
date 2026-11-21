/** One page of the app for a place: the subject in `?view=` (home by default) of the place named by the address. */
import { copy } from "@mzizi/copy";
import PlaceStatistics from "#/app/(app)/_views/place-statistics";
import PlaceHome from "#/app/(app)/_views/place-home";
import Link from "#/components/navigation/demo-link";
import { PageHeader } from "#/components/ui/page-header";
import { isView, VIEWS, type ViewId } from "#/lib/navigation/route";
import { effectiveLanguage, getCopy } from "#/lib/server/copy";

export default async function PlacePage({
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
  if (view === "overview") return <PlaceHome address={address} language={language} />;
  if (view === "statistics") {
    const topic = Array.isArray(query.topic) ? query.topic[0] : query.topic;
    return <PlaceStatistics address={address} language={language} topic={topic} />;
  }

  // The other subjects are added one at a time; the address already names them, so a shared link keeps its meaning.
  const t = await getCopy(language);
  const subject = t(copy.shell.link[view]);
  const href = `/${[country, ...place].join("/")}`;
  return (
    <>
      <PageHeader eyebrow={t(copy.shell.group[VIEWS[view].group.toLowerCase() as "politics" | "government" | "money" | "data"])} title={t(copy.place.pending.title, { subject })}>
        {t(copy.place.pending.text)}
      </PageHeader>
      <Link href={href} className="text-sm font-medium text-accent">
        {t(copy.place.pending.back, { place: place.length ? decodeURIComponent(place.at(-1)!) : country.toUpperCase() })}
      </Link>
    </>
  );
}
