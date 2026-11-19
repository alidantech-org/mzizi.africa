"use client";
/**
 * Choices in a single row. As many chips as fit are shown; the rest go behind a "…" button that opens a small
 * searchable list. The picked chip is always kept in view. The row never wraps, so its height never changes.
 */
import { MoreHorizontal, Search } from "lucide-react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";

export type Chip = { id: string; label: string; tag?: string; icon?: ReactNode; disabled?: boolean };
const GAP = 6, MORE = 40;

export function ChipRow({ label, items, value, onPick }: { label: string; items: Chip[]; value: string; onPick: (id: string) => void }) {
  const box = useRef<HTMLDivElement>(null);
  const probe = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState(items.length);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [up, setUp] = useState(false);

  useLayoutEffect(() => {
    const measure = () => {
      const widths = [...(probe.current?.children ?? [])].map((c) => (c as HTMLElement).offsetWidth);
      const room = box.current?.clientWidth ?? 0;
      let used = 0, n = 0;
      for (const w of widths) { const next = used + w + (n ? GAP : 0); if (next + (n + 1 < widths.length ? GAP + MORE : 0) > room) break; used = next; n++; }
      setFit(n === widths.length ? n : Math.max(1, n));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (box.current) ro.observe(box.current);
    return () => ro.disconnect();
  }, [items]);

  // The picked chip is moved into the visible part if it would otherwise sit behind the "…" button.
  const shown = useMemo(() => {
    const head = items.slice(0, fit);
    const picked = items.find((i) => i.id === value);
    if (!picked || head.includes(picked) || fit >= items.length) return head;
    return [...head.slice(0, Math.max(0, fit - 1)), picked];
  }, [items, fit, value]);
  const rest = items.filter((i) => !shown.includes(i));

  useEffect(() => { if (!open) return; const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false); const away = (e: MouseEvent) => { if (!box.current?.contains(e.target as Node)) setOpen(false); }; addEventListener("keydown", esc); addEventListener("mousedown", away); return () => { removeEventListener("keydown", esc); removeEventListener("mousedown", away); }; }, [open]);

  const cls = (on: boolean, disabled?: boolean) => `flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md border px-2.5 py-1 text-sm transition ${on ? "border-accent bg-accent-soft font-medium" : "border-line hover:border-muted"} ${disabled ? "pointer-events-none opacity-45" : ""}`;
  const body = (i: Chip) => <>{i.icon}{i.label}{i.tag && <span className="text-[10px] uppercase tracking-wider text-accent">{i.tag}</span>}</>;
  const list = rest.filter((i) => i.label.toLowerCase().includes(q.trim().toLowerCase()));

  return (
    <div ref={box} className="relative min-w-0 flex-1">
      <div className="flex items-center gap-1.5 overflow-hidden" role="group" aria-label={label}>
        {shown.map((i) => <button key={i.id} type="button" disabled={i.disabled} onClick={() => onPick(i.id)} aria-pressed={value === i.id} className={cls(value === i.id, i.disabled)}>{body(i)}</button>)}
        {rest.length > 0 && <button type="button" onClick={() => { const body = box.current?.closest(".overflow-y-auto")?.getBoundingClientRect(); const me = box.current?.getBoundingClientRect(); setUp(!!body && !!me && body.bottom - me.bottom < 250); setOpen(!open); setQ(""); }} aria-expanded={open} aria-label={`More ${label.toLowerCase()} options (${rest.length})`} title={`${rest.length} more`} className="grid h-[30px] w-10 shrink-0 place-items-center rounded-md border border-line text-muted hover:border-muted hover:text-ink"><MoreHorizontal size={16} /></button>}
      </div>
      {/* Hidden copy used only to measure every chip. */}
      <div aria-hidden className="pointer-events-none invisible absolute inset-x-0 top-0 h-0 overflow-hidden"><div ref={probe} className="flex w-max gap-1.5">{items.map((i) => <span key={i.id} className={cls(false)}>{body(i)}</span>)}</div></div>
      {open && (
        <div role="dialog" aria-label={`More ${label.toLowerCase()} options`} className={`floating absolute right-0 z-20 w-64 rounded-lg border border-line bg-surface p-1.5 ${up ? "bottom-full mb-1.5" : "top-full mt-1.5"}`}>
          <div className="flex items-center gap-2 border-b border-line px-2 pb-1.5"><Search size={13} className="text-muted" /><input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Search ${label.toLowerCase()}`} aria-label={`Search ${label.toLowerCase()}`} className="h-7 w-full bg-transparent text-sm outline-none placeholder:text-muted" /></div>
          <ul className="mt-1 max-h-52 overflow-y-auto">{list.map((i) => <li key={i.id}><button type="button" disabled={i.disabled} onClick={() => { onPick(i.id); setOpen(false); }} className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-sm hover:bg-accent-soft disabled:opacity-45">{body(i)}</button></li>)}{!list.length && <li className="px-2.5 py-2 text-sm text-muted">Nothing matches.</li>}</ul>
        </div>
      )}
    </div>
  );
}
