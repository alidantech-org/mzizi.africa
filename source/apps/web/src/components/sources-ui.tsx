"use client";
/**
 * Sources: a compact strip under each view, a side sheet with the details and files, and a confirmation
 * before leaving for an external site. Disclaimers live only in that confirmation.
 */
import { ArrowLeft, ArrowUpRight, Download, ExternalLink, FileText, Lightbulb, ChevronLeft, ChevronRight, FileSpreadsheet, FileType2, Library } from "lucide-react";
import { useEffect, useState } from "react";
import { sourceById, SOURCES, TIPS, VIEW_SOURCES, type Source, type SourceFile } from "#/data/sources";
import type { ViewId } from "#/lib/route";
import { FileViewer } from "./file-viewer";
import { buttonClass, DialogShell, SheetShell } from "./shells";

const when = (iso: string) => new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
const host = (url: string) => { try { return new URL(url).host; } catch { return url; } };
const icon = (k: SourceFile["kind"]) => (k === "xlsx" || k === "csv" ? <FileSpreadsheet size={14} /> : k === "pdf" || k === "docx" ? <FileType2 size={14} /> : <FileText size={14} />);

/** Confirmation before an external site. The only place the disclaimers appear. */
function ExternalDialog({ url, label, source, onClose }: { url: string | null; label: string; source: Source; onClose: () => void }) {
  return (
    <DialogShell open={!!url} onOpenChange={(o) => !o && onClose()} title="Open an external site?" description={url ? host(url) : ""} icon={<ExternalLink size={16} />} maxWidth="max-w-lg"
      footerRight={<><button onClick={onClose} className={buttonClass.outline}>Stay here</button><a href={url ?? "#"} target="_blank" rel="noopener noreferrer" onClick={onClose} className={buttonClass.primary}>Open site</a></>}>
      <div className="space-y-3 p-5 text-sm leading-relaxed">
        <p>You are about to leave Mzizi for <b>{label}</b> at <code className="break-all text-accent">{url}</code>. It opens in a new tab and is run by {source.publisher}, not by us.</p>
        <p className="text-muted">If the page does not load, that is usually why: the site may have moved, changed or been taken down since we last looked. Files we already downloaded can also be moved or removed from our system.</p>
        <p className="rounded-md border border-line px-3 py-2 text-xs text-muted">We last confirmed this address and content on <b className="text-ink">{when(source.lastChecked)}</b>.</p>
      </div>
    </DialogShell>
  );
}

export function SourceSheet({ source, onClose }: { source: Source | null; onClose: () => void }) {
  const [file, setFile] = useState<SourceFile | null>(null);
  const [external, setExternal] = useState<{ url: string; label: string } | null>(null);
  useEffect(() => setFile(null), [source]);
  if (!source) return null;
  const ext = (url: string, label: string) => setExternal({ url, label });
  return (
    <>
      <SheetShell open onOpenChange={(o) => !o && onClose()} width={file ? 760 : 480} icon={<Library size={16} />} title={file ? file.label : source.title} description={file ? source.title : source.publisher}
        headerActions={file ? <button onClick={() => setFile(null)} className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted hover:bg-accent-soft hover:text-ink"><ArrowLeft size={13} />Details</button> : undefined}
        footerLeft={file ? <a href={file.url} download className={`${buttonClass.outline} flex items-center gap-1.5`}><Download size={14} />Download</a> : undefined}
        footerRight={<button onClick={onClose} className={buttonClass.outline}>Close</button>} bodyClassName={file ? "p-0" : ""}>
        {file ? <FileViewer file={file} /> : (
          <div className="space-y-5 p-5 text-sm">
            <p className="text-muted">{source.summary}</p>
            <dl className="divide-y divide-line rounded-md border border-line">
              {[["Publisher", source.publisher], ["Licence", source.licence], ["Retrieved", when(source.retrieved)], ["Last confirmed", when(source.lastChecked)]].map(([k, v]) => <div key={k} className="flex justify-between gap-4 px-3 py-2"><dt className="text-muted">{k}</dt><dd className="text-right font-medium">{v}</dd></div>)}
            </dl>
            {source.files.length > 0 && <section><h3 className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted">Files we hold</h3>
              <ul className="space-y-1.5">{source.files.map((f) => <li key={f.url}><button onClick={() => setFile(f)} className="flex w-full items-center gap-2.5 rounded-md border border-line px-3 py-2 text-left hover:bg-accent-soft">{icon(f.kind)}<span className="flex-1">{f.label}</span><span className="font-mono text-[10px] uppercase text-muted">{f.kind}</span><ChevronRight size={14} className="text-muted" /></button></li>)}</ul></section>}
            {(source.originalUrl || source.obtainedFrom) && <section><h3 className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted">Go to the source</h3>
              <div className="flex flex-wrap gap-2">
                {source.originalUrl && <button onClick={() => ext(source.originalUrl!, "the original source")} className={`${buttonClass.outline} flex items-center gap-1.5`}>Original site <ArrowUpRight size={14} /></button>}
                {source.obtainedFrom && source.obtainedFrom !== source.originalUrl && <button onClick={() => ext(source.obtainedFrom!, "where we obtained this data")} className={`${buttonClass.outline} flex items-center gap-1.5`}>Where we got it <ArrowUpRight size={14} /></button>}
              </div></section>}
            {!source.files.length && !source.originalUrl && <p className="text-xs text-muted">No file or link: this record only explains where figures come from.</p>}
          </div>
        )}
      </SheetShell>
      <ExternalDialog url={external?.url ?? null} label={external?.label ?? ""} source={source} onClose={() => setExternal(null)} />
    </>
  );
}

/** Small row under a view: source chips on the left, one tip on the right. Deliberately quiet. */
export function ViewFooter({ view }: { view: ViewId }) {
  const [open, setOpen] = useState<Source | null>(null);
  const [tip, setTip] = useState(0);
  const ids = VIEW_SOURCES[view];
  const tips = TIPS[view];
  return (
    <footer className="mt-10 border-t border-line pt-3 text-xs text-muted">
      {ids.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 font-mono text-[10px] uppercase tracking-widest">Sources</span>
          {ids.map((id) => { const s = sourceById(id); return <button key={id} onClick={() => setOpen(s)} className="rounded-md border border-line px-2 py-0.5 hover:bg-accent-soft hover:text-ink">{s.title}</button>; })}
        </div>
      )}
      {tips.length > 0 && (
        <p className="mt-2 flex items-start gap-2"><Lightbulb size={13} className="mt-0.5 shrink-0 text-accent" /><span className="flex-1">{tips[tip % tips.length]}</span>
          {tips.length > 1 && <span className="flex shrink-0 gap-0.5"><button aria-label="Previous tip" onClick={() => setTip((t) => t + tips.length - 1)} className="grid size-5 place-items-center rounded hover:bg-accent-soft"><ChevronLeft size={12} /></button><button aria-label="Next tip" onClick={() => setTip((t) => t + 1)} className="grid size-5 place-items-center rounded hover:bg-accent-soft"><ChevronRight size={12} /></button></span>}</p>
      )}
      <SourceSheet source={open} onClose={() => setOpen(null)} />
    </footer>
  );
}

/** The full list on the Sources view. Every row opens the same sheet. */
export function SourceList() {
  const [open, setOpen] = useState<Source | null>(null);
  return (
    <>
      <ul className="divide-y divide-line rounded-lg border border-line bg-surface">
        {SOURCES.map((s) => <li key={s.id}><button onClick={() => setOpen(s)} className="flex w-full items-center gap-4 px-4 py-3 text-left hover:bg-accent-soft"><div className="min-w-0 flex-1"><div className="font-medium">{s.title}</div><div className="truncate text-xs text-muted">{s.publisher} · confirmed {when(s.lastChecked)}</div></div><span className="hidden gap-1 sm:flex">{s.files.map((f) => <span key={f.url} className="rounded bg-line px-1.5 py-0.5 font-mono text-[10px] uppercase">{f.kind}</span>)}</span><ChevronRight size={14} className="text-muted" /></button></li>)}
      </ul>
      <SourceSheet source={open} onClose={() => setOpen(null)} />
    </>
  );
}
