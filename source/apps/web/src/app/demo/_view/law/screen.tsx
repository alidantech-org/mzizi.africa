/**
 * Law. view.entity=instrument, view.id=constitution, view.chapter=4, view.provision=article-43.
 * A provision must belong to the chapter in the address; a bad combination is an error, never a silent redirect.
 */
import { Suspense } from "react";
import { ArticleReader, type Provision } from "#demo/_view/law/components/article-reader";
import { Panel } from "#demo/_components/ui/panel";
import { PageHeader, RealTag } from "#demo/_components/ui/primitives";
import chapters from "#demo/_data/generated/constitution/index.json";
import { build } from "#demo/_lib/navigation/route";
import Link from "#demo/_components/navigation/demo-link";
import { placeName, type ViewProps } from "#demo/_view/shared/types";

const slugOf = (designation: string) => designation.toLowerCase().replace(/\s+/g, "-");
const articlesOf = (n: Provision): Provision[] => (n.kind === "article" ? [n] : n.children.flatMap(articlesOf));
const Err = ({ children }: { children: React.ReactNode }) => (
  <div role="alert" className="mb-5 rounded-lg border border-c1 bg-c1/10 p-4 text-sm">
    {children}
  </div>
);

export async function Law({ ctx, place, lang }: ViewProps) {
  const { "view.entity": entity, "view.id": id, "view.chapter": chapter, "view.provision": provision } = ctx.params;
  const country = place.countryName;
  const bad = (entity && entity !== "instrument") || (id && id !== "constitution");
  const meta = chapter ? chapters.find((c) => String(c.number) === chapter) : undefined;
  const chapterBad = chapter && !meta;
  let data: Provision | undefined;
  let provisionBad = false;
  let sw: { translated: Record<string, string>; total: number; count: number; status: string; basis: string } | undefined;
  if (meta && !bad) {
    data = (await import(`../../_data/generated/constitution/ch-${meta.number}.json`)).default as Provision;
    if (lang === "sw") sw = (await import(`../../_data/generated/constitution/sw/ch-${meta.number}.json`)).default;
    provisionBad = !!provision && !articlesOf(data).some((a) => slugOf(a.d) === provision);
  }
  const lead = (
    <>
      Constitution of Kenya, 2010. As the highest law it applies throughout {country}, including {placeName(place)}. County and
      subsidiary legislation is not loaded, so whether it applies here is unknown.
    </>
  );

  if (bad)
    return (
      <>
        <PageHeader eyebrow="Law" title="Instrument not found">
          {lead}
        </PageHeader>
        <Err>
          No instrument matches{" "}
          <b>
            {entity ?? "instrument"} {id}
          </b>
          . Only <code>instrument / constitution</code> is loaded.
        </Err>
      </>
    );
  if (chapterBad)
    return (
      <>
        <PageHeader eyebrow="Law" title="Chapter not found">
          {lead}
        </PageHeader>
        <Err>
          The Constitution has chapters 1 to {chapters.length}; <b>{chapter}</b> is not one of them.
        </Err>
      </>
    );
  if (!meta || !data) {
    return (
      <>
        <PageHeader
          eyebrow={`Law · ${placeName(place)}`}
          title="From the highest authority down"
          actions={<RealTag>{chapters.reduce((n, c) => n + c.articles, 0)} articles</RealTag>}
        >
          {lead}
        </PageHeader>
        <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
          <aside className="h-fit rounded-lg border border-line bg-surface p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted">Instruments</div>
            <ul className="mt-3 space-y-1 text-sm">
              <li className="rounded-md bg-accent-soft px-3 py-2.5 font-medium">
                1 · Constitution of Kenya, 2010<div className="mt-0.5 text-xs font-normal text-muted">Scope: national</div>
              </li>
              {["Acts of Parliament", "Subsidiary legislation", "County legislation"].map((x, i) => (
                <li key={x} className="flex items-center justify-between px-3 py-2.5 text-muted">
                  {i + 2} · {x}
                  <span className="rounded bg-line px-2 py-0.5 text-[10px]">Not loaded</span>
                </li>
              ))}
            </ul>
          </aside>
          <Panel title="Chapters" note="Select one">
            <ol className="divide-y divide-line">
              {chapters.map((c) => (
                <li key={c.number}>
                  <Link
                    href={build(ctx, {
                      view: "law",
                      params: { "view.entity": "instrument", "view.id": "constitution", "view.chapter": String(c.number) },
                    })}
                    className="flex items-center gap-4 py-3 text-sm hover:text-accent"
                  >
                    <span className="w-6 text-muted">{c.number}</span>
                    <span className="flex-1 font-medium">{c.title}</span>
                    <span className="font-mono text-[11px] text-muted">{c.articles} articles</span>
                  </Link>
                </li>
              ))}
            </ol>
          </Panel>
        </div>
      </>
    );
  }
  return (
    <>
      <PageHeader eyebrow={`Constitution of Kenya, 2010 · Chapter ${meta.number}`} title={meta.title}>
        {meta.articles} articles. Text is shown exactly as loaded from the seed. Applies throughout {country}.
      </PageHeader>
      {sw && (
        <div role="note" className="mb-5 rounded-lg border border-line bg-surface p-4 text-sm">
          <b>Kiswahili:</b> {sw.count} of {sw.total} provisions in this chapter have a translation ({sw.basis}; review status:{" "}
          {sw.status}). The rest are shown in English and marked, because no translation has been loaded for them.
        </div>
      )}
      {provisionBad && (
        <Err>
          Article <b>{provision}</b> is not part of Chapter {meta.number}. Showing the first article of this chapter.
        </Err>
      )}
      <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-surface" />}>
        <ArticleReader
          chapter={data}
          number={meta.number}
          selected={provisionBad ? undefined : provision}
          sw={sw?.translated}
          lang={lang}
        />
      </Suspense>
    </>
  );
}
