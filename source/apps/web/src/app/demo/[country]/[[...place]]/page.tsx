/**
 * Explorer: the path is the place, ?view= is the subject.
 *   /ke/nairobi/westlands?view=law&view.chapter=4
 */
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { LanguageNotice } from "#demo/_components/preferences/language-notice";
import { ViewFooter } from "#demo/_view/sources/components/sources-ui";
import { PageHeader } from "#demo/_components/ui/primitives";
import { resolvePlace } from "#demo/_data/places";
import { COUNTRIES, country, parseQuery, VIEWS, type Ctx } from "#demo/_lib/navigation/route";
import { Arms } from "#demo/_view/arms/screen";
import { Compare } from "#demo/_view/compare/screen";
import { Elections } from "#demo/_view/elections/screen";
import { Finance } from "#demo/_view/finance/screen";
import { Institutions } from "#demo/_view/institutions/screen";
import { Law } from "#demo/_view/law/screen";
import { Leaders } from "#demo/_view/leaders/screen";
import { Overview } from "#demo/_view/overview/screen";
import { Parliament } from "#demo/_view/parliament/screen";
import { Power } from "#demo/_view/power/screen";
import { Sources } from "#demo/_view/sources/screen";
import { Statistics } from "#demo/_view/statistics/screen";
import { Suppliers } from "#demo/_view/suppliers/screen";
import type { OkPlace } from "#demo/_view/shared/types";

export function generateStaticParams() {
  return COUNTRIES.map((c) => ({ country: c.code, place: [] as string[] }));
}

const everywhere = new Set(["overview", "compare", "sources"]);

async function Explorer({
  params,
  searchParams,
}: {
  params: Promise<{ country: string; place?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { country: code, place: trail = [] } = await params;
  if (!country(code)) notFound();
  const q = parseQuery(await searchParams);
  const resolved = resolvePlace(code, trail);
  if (!resolved.ok)
    return (
      <PageHeader eyebrow="Place not found" title="This place is not in the loaded data">
        {resolved.reason}
      </PageHeader>
    );
  const place: OkPlace = resolved;
  const ctx: Ctx = {
    country: code,
    trail,
    view: q.view,
    params: q.params,
    lang: q.lang,
  };

  const lang = q.lang ?? (await cookies()).get("mzizi-demo-lang")?.value ?? "en";
  const props = { ctx, place, lang };
  const unloaded = code !== "ke" && !everywhere.has(q.view);
  const view = (() => {
    switch (q.view) {
      case "overview":
        return <Overview {...props} />;
      case "leaders":
        return <Leaders {...props} />;
      case "institutions":
        return <Institutions {...props} />;
      case "arms":
        return <Arms {...props} />;
      case "power":
        return <Power {...props} />;
      case "law":
        return <Law {...props} />;
      case "parliament":
        return <Parliament {...props} />;
      case "elections":
        return <Elections {...props} />;
      case "finance":
        return <Finance {...props} />;
      case "suppliers":
        return <Suppliers {...props} />;
      case "statistics":
        return <Statistics {...props} />;
      case "compare":
        return <Compare {...props} />;
      case "sources":
        return <Sources {...props} />;
    }
  })();
  return (
    <>
      <LanguageNotice lang={lang} view={q.view} />
      {q.errors.length > 0 && (
        <div role="alert" className="mb-6 rounded-lg border border-c3 bg-c3/15 p-4 text-sm">
          <b>Part of this address was not understood.</b>
          <ul className="mt-1 list-inside list-disc text-muted">
            {q.errors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      )}
      {unloaded ? (
        <PageHeader
          eyebrow={`${VIEWS[q.view].label} · ${place.trail.at(-1)?.name ?? place.countryName}`}
          title="Not loaded for this country yet"
        >
          {VIEWS[q.view].label} has no data for {place.countryName} in this demo. The place and subject are kept, so switching
          country or subject keeps working. Overview shows what is loaded.
        </PageHeader>
      ) : (
        view
      )}
      <ViewFooter view={q.view} />
    </>
  );
}

export default function Page(props: PageProps<"/demo/[country]/[[...place]]">) {
  return (
    <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-surface" />}>
      <Explorer params={props.params as Promise<{ country: string; place?: string[] }>} searchParams={props.searchParams} />
    </Suspense>
  );
}
