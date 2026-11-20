"use client";
/**
 * A card that shows a few rows and pages through the rest, instead of scrolling. The footer (count and paging) is
 * pinned to the bottom of the card and only appears when there is more than one page. The page holding `selected`
 * opens first, and the page returns to it when the list or the selection changes.
 */
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

export function PagedList<T>({
  title,
  unit,
  items,
  pageSize = 8,
  selected,
  resetKey = "",
  render,
  empty,
  className = "",
}: {
  title?: ReactNode;
  unit: string;
  items: T[];
  pageSize?: number;
  selected?: number;
  resetKey?: string;
  render: (item: T, previous: T | undefined) => ReactNode;
  empty?: ReactNode;
  className?: string;
}) {
  const pages = Math.max(1, Math.ceil(items.length / pageSize));
  const home = selected != null && selected >= 0 ? Math.floor(selected / pageSize) : 0;
  const [page, setPage] = useState(home);
  useEffect(() => setPage(home), [home, resetKey, items.length]);
  const at = Math.min(page, pages - 1);
  const from = at * pageSize;
  const shown = items.slice(from, from + pageSize);
  const btn =
    "grid size-7 place-items-center rounded-md border border-line hover:bg-accent-soft disabled:pointer-events-none disabled:opacity-40";
  return (
    <div className={`flex flex-col rounded-lg border border-line bg-surface ${className}`}>
      <div className="p-3 pb-1">
        {title && <div className="px-3 pb-2 pt-2 font-mono text-[11px] uppercase tracking-widest text-muted">{title}</div>}
        {shown.length ? shown.map((it, i) => render(it, i > 0 ? shown[i - 1] : items[from - 1])) : empty}
      </div>
      {pages > 1 && (
        <div className="mt-auto flex items-center justify-between gap-2 border-t border-line px-4 py-2.5 text-xs text-muted">
          <span aria-live="polite" className="min-w-0 truncate">
            {from + 1}–{from + shown.length} of {items.length} {unit}
          </span>
          <div className="flex shrink-0 items-center gap-1.5">
            <button type="button" className={btn} disabled={at === 0} onClick={() => setPage(at - 1)} aria-label="Previous page">
              <ChevronLeft size={14} />
            </button>
            <button
              type="button"
              className={btn}
              disabled={at === pages - 1}
              onClick={() => setPage(at + 1)}
              aria-label="Next page"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
