/**
 * Explorer: the path is the place, ?view= is the subject.
 *   /ke/nairobi/westlands?view=law&view.chapter=4
 */
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { LanguageNotice } from "#/components/language-notice";
import { ViewFooter } from "#/components/sources-ui";
import { PageHeader } from "#/components/ui";
import { resolvePlace } from "#/data/places";
import { COUNTRIES, country, parseQuery, VIEWS, type Ctx } from "#/lib/route";
import { Arms } from "#/views/arms";
import { Compare } from "#/views/compare";
import { Elections } from "#/views/elections";
import { Finance } from "#/views/finance";
import { Institutions } from "#/views/institutions";
import { Law } from "#/views/law";
import { Leaders } from "#/views/leaders";
import { Overview } from "#/views/overview";
import { Parliament } from "#/views/parliament";
import { Power } from "#/views/power";
import { Sources } from "#/views/sources";
import { Statistics } from "#/views/statistics";
import { Suppliers } from "#/views/suppliers";
import type { OkPlace } from "#/views/types";

export function generateStaticParams() {
  return COUNTRIES.map((c) => ({ country: c.code, place: [] as string[] }));
}

const everywhere = new Set(["overview", "compare", "sources"]);

async function Explorer({ params, searchParams }: { params: Promise<{ country: string; place?: string[] }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { country: code, place: trail = [] } = await params;
  if (!country(code)) notFound();
  const q = parseQuery(await searchParams);
  const resolved = resolvePlace(code, trail);
  if (!resolved.ok) return <PageHeader eyebrow="Place not found" title="This place is not in the loaded data">{resolved.reason}</PageHeader>;
  const place: OkPlace = resolved;
  const ctx: Ctx = { country: code, trail, view: q.view, params: q.params, lang: q.lang };

  const lang = q.lang ?? (await cookies()).get("mzizi-lang")?.value ?? "en";
  const props = { ctx, place, lang };
  const unloaded = code !== "ke" && !everywhere.has(q.view);
  const view = (() => {
    switch (q.view) {
      case "overview": return <Overview {...props} />;
      case "leaders": return <Leaders {...props} />;
      case "institutions": return <Institutions {...props} />;
      case "arms": return <Arms {...props} />;
      case "power": return <Power {...props} />;
      case "law": return <Law {...props} />;
      case "parliament": return <Parliament {...props} />;
      case "elections": return <Elections {...props} />;
      case "finance": return <Finance {...props} />;
      case "suppliers": return <Suppliers {...props} />;
      case "statistics": return <Statistics {...props} />;
      case "compare": return <Compare {...props} />;
      case "sources": return <Sources {...props} />;
    }
  })();
  return (
    <>
      <LanguageNotice lang={lang} view={q.view} />
      {q.errors.length > 0 && <div role="alert" className="mb-6 rounded-lg border border-c3 bg-c3/15 p-4 text-sm"><b>Part of this address was not understood.</b><ul className="mt-1 list-inside list-disc text-muted">{q.errors.map((e) => <li key={e}>{e}</li>)}</ul></div>}
      {unloaded ? (
        <PageHeader eyebrow={`${VIEWS[q.view].label} · ${place.trail.at(-1)?.name ?? place.countryName}`} title="Not loaded for this country yet">{VIEWS[q.view].label} has no data for {place.countryName} in this demo. The place and subject are kept, so switching country or subject keeps working. Overview shows what is loaded.</PageHeader>
      ) : view}
      <ViewFooter view={q.view} />
    </>
  );
}

export default function Page(props: PageProps<"/[country]/[[...place]]">) {
  return (
    <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-surface" />}>
      <Explorer params={props.params as Promise<{ country: string; place?: string[] }>} searchParams={props.searchParams} />
    </Suspense>
  );
}
