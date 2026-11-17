"use client";

/** Previous and next controls over a page window; "next" is offered when the last page came back full. */
import type { PageWindow } from "#ui/lib/types.ts";

export interface PaginationProps {
  readonly window: PageWindow;
  readonly received: number;
  readonly onChange: (window: PageWindow) => void;
}

export function Pagination({ window, received, onChange }: PaginationProps) {
  const hasPrevious = window.offset > 0;
  const hasNext = received >= window.limit;
  const move = (offset: number) => onChange({ limit: window.limit, offset: Math.max(offset, 0) });
  const button =
    "rounded-[var(--radius-sm)] border border-border-default px-3 py-1 text-sm disabled:opacity-40";
  return (
    <nav className="flex items-center gap-3 text-content-primary" aria-label="Pages">
      <button
        type="button"
        className={button}
        disabled={!hasPrevious}
        onClick={() => move(window.offset - window.limit)}
      >
        Previous
      </button>
      <span className="text-sm">
        {window.offset + 1} to {window.offset + received}
      </span>
      <button
        type="button"
        className={button}
        disabled={!hasNext}
        onClick={() => move(window.offset + window.limit)}
      >
        Next
      </button>
    </nav>
  );
}
