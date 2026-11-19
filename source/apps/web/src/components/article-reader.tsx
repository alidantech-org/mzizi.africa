"use client";
/** Reads one chapter: articles on the left, the selected article on the right. Selection lives in the URL. */
import Link from "next/link";
import { useMemo, useState } from "react";
import { useNav } from "#/lib/use-ctx";
import { PagedList } from "./paged-list";
import { CiteSheet, ProvisionTree, type P, type Sw } from "./cite";

export type Provision = P;
const articlesOf = (n: P): P[] => (n.kind === "article" ? [n] : n.children.flatMap(articlesOf));
const slugOf = (d: string) => d.toLowerCase().replace(/\s+/g, "-");

export function ArticleReader({ chapter, number, selected, sw, lang }: { chapter: P; number: number; selected?: string; sw?: Sw["translated"]; lang: string }) {
  const nav = useNav();
  const [full, setFull] = useState<string | null>(null);
  const articles = useMemo(() => articlesOf(chapter), [chapter]);
  const sel = articles.find((a) => slugOf(a.d) === selected) ?? articles[0];
  const setCode = (c: string) => { const a = articles.find((x) => x.code === c)!; nav.set({ "view.provision": slugOf(a.d) }, false); };
  const t = (a: P) => (lang === "sw" && sw?.[a.code]) || a.title;
  return (
    <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
      <nav aria-label="Articles" className="lg:sticky lg:top-4 lg:self-start">
        <PagedList unit="articles" items={articles} pageSize={10} selected={articles.findIndex((a) => a.code === sel?.code)} resetKey={chapter.code}
          render={(a) => <button key={a.code} onClick={() => setCode(a.code)} aria-current={a.code === sel?.code} className={`flex w-full gap-3 rounded-md px-3 py-2 text-left text-sm transition ${a.code === sel?.code ? "bg-accent text-paper" : "hover:bg-accent-soft"}`}><span className="w-16 shrink-0 opacity-70">{a.d.replace("Article ", "Art. ")}</span><span>{t(a)}</span></button> } />
      </nav>
      {sel && (
        <article className="rounded-xl border border-line bg-surface p-8" lang={lang}>
          <div className="flex items-center gap-3 text-xs text-muted"><span className="rounded-full bg-c2/15 px-2.5 py-1 font-medium text-c2">Provision</span>Constitution of Kenya · Chapter {number}</div>
          <h2 className="mt-4 font-display text-4xl leading-tight tracking-tight">{sel.d}. {t(sel)}</h2>
          <div className="mt-6 border-t border-line pt-6 font-display text-[17px]"><ProvisionTree p={sel} article={sel} sw={sw} lang={lang} onFull={setFull} /></div>
          <div className="mt-8 flex items-center justify-between border-t border-line pt-4 text-xs text-muted"><span>Source: published text of the Constitution</span><Link href={nav.href({ params: { "view.entity": "instrument", "view.id": "constitution" } })} className="font-medium text-accent">All chapters</Link></div>
          {full && <CiteSheet article={full} open onOpenChange={() => setFull(null)} />}
        </article>
      )}
    </div>
  );
}
