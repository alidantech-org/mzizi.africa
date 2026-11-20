"use client";
/**
 * Constitution text. Numbers sit in their own column so wrapped text never runs under them. References to other
 * parts ("Article 43(2)(b)", "clause (2)(b)") are underlined links that open a small popover and offer the full article.
 * Swahili is shown where a translation exists; anything missing stays English and says so.
 */
import { BookOpen } from "lucide-react";
import Link from "#demo/_components/navigation/demo-link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import articles from "#demo/_data/generated/constitution/articles.json";
import { build } from "#demo/_lib/navigation/route";
import { readLang } from "#demo/_lib/preferences/saved";
import { useNav } from "#demo/_lib/navigation/use-ctx";
import { buttonClass, SheetShell } from "#demo/_components/ui/shells";

export type P = { code: string; kind: string; d: string; title: string; text: string; children: P[] };
export type Sw = { translated: Record<string, string>; total: number; count: number; status: string; basis: string };
type Ctx = { article?: P; clause?: P; sw?: Sw["translated"] };

const chapterOf = (num: string) => (articles as Record<string, number>)[num];
const findArticle = (n: P, d: string): P | undefined =>
  n.kind === "article" && n.d === d ? n : n.children.map((c) => findArticle(c, d)).find(Boolean);
const loadChapter = async (chapter: number) =>
  (await import(`../../../_data/generated/constitution/ch-${chapter}.json`)).default as P;
const loadSw = async (chapter: number) =>
  (await import(`../../../_data/generated/constitution/sw/ch-${chapter}.json`)).default as Sw;

/** Matches "Article 43", "Article 43(2)(b)", "clause (2)(b)", "paragraph (b)", "sub-article (3)". */
const REF =
  /\bArticles?\s+\d+(?:\s*\(\d+\))?(?:\s*\([a-z]+\))?|\b(?:clauses?|paragraphs?|sub-?articles?|sub-?paragraphs?)\s+\([0-9a-z]+\)(?:\s*\([0-9a-z]+\))?/gi;

function split(text: string): { text: string; ref?: boolean }[] {
  const out: { text: string; ref?: boolean }[] = [];
  let last = 0;
  for (const m of text.matchAll(REF)) {
    if (m.index > last) out.push({ text: text.slice(last, m.index) });
    out.push({ text: m[0], ref: true });
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push({ text: text.slice(last) });
  return out;
}

type Resolved = { heading: string; node: P; article: string };
async function resolve(ref: string, ctx: Ctx): Promise<Resolved | null> {
  const abs = ref.match(/^Articles?\s+(\d+)\s*(?:\(([0-9a-z]+)\))?\s*(?:\(([0-9a-z]+)\))?/i);
  const parts = (s: string) => [...s.matchAll(/\(([0-9a-z]+)\)/gi)].map((m) => m[1]);
  let article: P | undefined,
    path: string[] = [],
    num = "";
  if (abs) {
    num = abs[1];
    const ch = chapterOf(num);
    if (!ch) return null;
    article = findArticle(await loadChapter(ch), `Article ${num}`);
    path = [abs[2], abs[3]].filter(Boolean) as string[];
  } else {
    article = ctx.article;
    path = parts(ref);
    num = article?.d.replace("Article ", "") ?? "";
  }
  if (!article) return null;
  let node = article;
  const shown = [article.d];
  const rel = !abs && /^paragraph|^sub-?paragraph/i.test(ref) && ctx.clause ? ctx.clause : article;
  node = rel;
  for (const step of path) {
    const next = node.children.find((c) => c.d === `(${step})`);
    if (!next) break;
    node = next;
    shown.push(`(${step})`);
  }
  if (node === article && path.length) return null;
  return {
    heading: abs
      ? `${article.d}${shown.slice(1).join("")}`
      : `${article.d} ${shown.slice(rel === ctx.clause ? 0 : 1).join("")}`.trim(),
    node,
    article: num,
  };
}

function Plain({ p, depth = 0 }: { p: P; depth?: number }) {
  return (
    <div className={depth ? "mt-1.5" : ""}>
      <div className="flex gap-2">
        <span className="w-8 shrink-0 text-right font-mono text-[11px] text-accent">{p.kind !== "article" ? p.d : ""}</span>
        <div className="min-w-0 flex-1">
          {p.title && p.kind !== "article" && <b>{p.title} </b>}
          {p.text}
          {p.children.map((c) => (
            <Plain key={c.code} p={c} depth={depth + 1} />
          ))}
        </div>
      </div>
    </div>
  );
}

function RefLink({ text, ctx, onFull }: { text: string; ctx: Ctx; onFull: (article: string) => void }) {
  const [open, setOpen] = useState(false);
  const [res, setRes] = useState<Resolved | null | undefined>(undefined);
  const [pos, setPos] = useState({ left: 8, top: 8, width: 380 });
  const btn = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setOpen(false);
      }
    };
    addEventListener("keydown", close, true);
    return () => removeEventListener("keydown", close, true);
  }, [open]);
  const show = async () => {
    const r = btn.current!.getBoundingClientRect();
    const width = Math.min(400, innerWidth - 16);
    const below = innerHeight - r.bottom > 260;
    setPos({
      left: Math.max(8, Math.min(r.left, innerWidth - width - 8)),
      top: below ? r.bottom + 6 : Math.max(8, r.top - 6 - 240),
      width,
    });
    setOpen(true);
    if (res === undefined) setRes(await resolve(text, ctx));
  };
  return (
    <>
      <button
        ref={btn}
        onClick={show}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="cursor-pointer text-accent underline decoration-accent/60 underline-offset-2 hover:bg-accent-soft"
      >
        {text}
      </button>
      {open &&
        createPortal(
          <>
            <div className="fixed inset-0 z-[90]" onMouseDown={() => setOpen(false)} />
            <div
              role="dialog"
              aria-label={`Reference ${text}`}
              style={{ left: pos.left, top: pos.top, width: pos.width }}
              className="floating fixed z-[91] max-h-60 overflow-y-auto rounded-lg border border-line bg-surface p-3 font-sans text-sm"
            >
              {res === undefined && (
                <p className="text-muted" role="status">
                  Loading…
                </p>
              )}
              {res === null && <p className="text-muted">That reference could not be found in the loaded text.</p>}
              {res && (
                <>
                  <div className="mb-1.5 flex items-center justify-between gap-2">
                    <b className="text-accent">{res.heading}</b>
                  </div>
                  <div className="font-display text-[14px] leading-relaxed">
                    <Plain p={res.node} />
                  </div>
                  <button
                    onClick={() => {
                      setOpen(false);
                      onFull(res.article);
                    }}
                    className="mt-2 text-xs font-medium text-accent hover:underline"
                  >
                    View full Article {res.article}
                  </button>
                </>
              )}
            </div>
          </>,
          document.body,
        )}
    </>
  );
}

/** Text with its references turned into links. */
export function RefText({ text, ctx, onFull }: { text: string; ctx: Ctx; onFull: (article: string) => void }) {
  return (
    <>
      {split(text).map((s, i) =>
        s.ref ? <RefLink key={i} text={s.text} ctx={ctx} onFull={onFull} /> : <span key={i}>{s.text}</span>,
      )}
    </>
  );
}

/** One provision and its children, numbers in a fixed column (hanging indent). */
export function ProvisionTree({
  p,
  article,
  clause,
  sw,
  lang,
  onFull,
  depth = 0,
}: {
  p: P;
  article: P;
  clause?: P;
  sw?: Sw["translated"];
  lang: string;
  onFull: (article: string) => void;
  depth?: number;
}) {
  const tr = lang === "sw" ? sw?.[p.code] : undefined;
  const missing = lang === "sw" && !tr && (p.text || p.title);
  const here = p.kind === "clause" ? p : clause;
  const own = tr ?? p.text;
  const skip = p.kind === "article" && (!p.text || p.text === p.title);
  if (p.kind === "article")
    return (
      <div>
        {!skip && (
          <p className={`mb-2 leading-relaxed ${missing ? "italic text-muted" : ""}`} lang={missing ? "en" : lang}>
            <RefText text={own} ctx={{ article, clause: here }} onFull={onFull} />
          </p>
        )}
        {p.children.map((c) => (
          <ProvisionTree key={c.code} p={c} article={article} clause={here} sw={sw} lang={lang} onFull={onFull} depth={1} />
        ))}
      </div>
    );
  return (
    <div className={depth ? "mt-2" : ""}>
      <div className="flex gap-3">
        <span className="w-10 shrink-0 pt-[0.28em] text-right font-mono text-xs text-accent">
          {p.kind !== "article" ? p.d : ""}
        </span>
        <div className="min-w-0 flex-1">
          {!skip && (
            <p className={`leading-relaxed ${missing ? "italic text-muted" : ""}`} lang={missing ? "en" : lang}>
              {p.title && p.kind !== "article" && <b className="mr-1.5">{p.title}</b>}
              <RefText text={own} ctx={{ article, clause: here }} onFull={onFull} />
              {missing && (
                <span className="ml-2 rounded bg-line px-1.5 py-0.5 font-mono text-[10px] not-italic uppercase">
                  English only
                </span>
              )}
            </p>
          )}
          {p.children.map((c) => (
            <ProvisionTree
              key={c.code}
              p={c}
              article={article}
              clause={here}
              sw={sw}
              lang={lang}
              onFull={onFull}
              depth={depth + 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/** Side sheet with one article. Controlled, so references inside other texts can open it. */
export function CiteSheet({
  article,
  open,
  onOpenChange,
}: {
  article: string;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const num = article.match(/\d+/)?.[0];
  const chapter = num ? chapterOf(num) : undefined;
  const nav = useNav();
  const [node, setNode] = useState<P | null>(null);
  const [sw, setSw] = useState<Sw | null>(null);
  const [missing, setMissing] = useState(false);
  const [again, setAgain] = useState<string | null>(null);
  const lang = nav.ctx.lang ?? (typeof document !== "undefined" ? readLang() : "en");
  useEffect(() => {
    if (!open || !chapter || !num) return;
    let live = true;
    loadChapter(chapter).then((ch) => {
      const a = findArticle(ch, `Article ${num}`);
      if (live) a ? setNode(a) : setMissing(true);
    });
    if (lang === "sw") loadSw(chapter).then((s) => live && setSw(s));
    return () => {
      live = false;
    };
  }, [open, chapter, num, lang]);
  if (!num || !chapter) return null;
  const lawHref = build(nav.ctx, {
    view: "law",
    params: {
      "view.entity": "instrument",
      "view.id": "constitution",
      "view.chapter": String(chapter),
      "view.provision": `article-${num}`,
    },
  });
  const title = node ? `${node.d}. ${(lang === "sw" && sw?.translated[node.code]) || node.title}` : `Article ${num}`;
  return (
    <>
      <SheetShell
        open={open}
        onOpenChange={onOpenChange}
        icon={<BookOpen size={16} />}
        title={title}
        description={`Constitution of Kenya, 2010 · Chapter ${chapter}${lang === "sw" ? " · Kiswahili where translated" : ""}`}
        footerLeft={
          <Link href={lawHref} onClick={() => onOpenChange(false)} className={buttonClass.outline}>
            Open in Law view
          </Link>
        }
        footerRight={
          <button onClick={() => onOpenChange(false)} className={buttonClass.outline}>
            Close
          </button>
        }
      >
        <div className="p-5 font-display text-[16px]">
          {!node && !missing && (
            <p className="font-sans text-sm text-muted" role="status">
              Loading…
            </p>
          )}
          {missing && <p className="font-sans text-sm text-muted">This article could not be found in the loaded text.</p>}
          {node && <ProvisionTree p={node} article={node} sw={sw?.translated} lang={lang} onFull={setAgain} />}
        </div>
      </SheetShell>
      {again && <CiteSheet article={again} open onOpenChange={() => setAgain(null)} />}
    </>
  );
}

/** A link-like button that opens an article in the side sheet. `article` may be "Article 179", "179" or "Articles 164 and 165". */
export function Cite({ article, children }: { article: string; children?: ReactNode }) {
  const num = article.match(/\d+/)?.[0];
  const [open, setOpen] = useState(false);
  if (!num || !chapterOf(num)) return <span>{children ?? article}</span>;
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1 rounded-md px-1 text-accent underline decoration-dotted underline-offset-2 hover:bg-accent-soft"
      >
        {children ?? `Article ${num}`}
      </button>
      <CiteSheet article={num} open={open} onOpenChange={setOpen} />
    </>
  );
}
