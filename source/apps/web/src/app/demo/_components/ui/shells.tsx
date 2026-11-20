"use client";
/**
 * Shared shells for every sheet and dialog, following the RideRescue shell concept:
 * header (icon, title, badge, description, actions) / scrollable body / footer (left and right).
 */
import { Maximize2, Minimize2, X } from "lucide-react";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

type Common = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  badge?: ReactNode;
  headerActions?: ReactNode;
  footerLeft?: ReactNode;
  footerRight?: ReactNode;
  showFooter?: boolean;
  bodyClassName?: string;
  /** 0 to 1: a thin progress bar along the bottom edge of the header. */
  progress?: number;
  children: ReactNode;
};

/** Escape to close, focus moves in, Tab stays inside, focus returns on close. */
function useModal(open: boolean, onClose: () => void) {
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const before = document.activeElement as HTMLElement | null;
    const node = panel.current;
    node?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (document.querySelector("[data-trigger=Select],[data-trigger=ComboBox]")) return;
        /* a list is open: Escape closes only that */ e.stopPropagation();
        onClose();
      }
      if (e.key !== "Tab" || !node) return;
      const items = [
        ...node.querySelectorAll<HTMLElement>(
          'a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])',
        ),
      ].filter((x) => x.offsetParent !== null);
      if (!items.length) return;
      const [first, last] = [items[0], items[items.length - 1]];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    addEventListener("keydown", key, true);
    return () => {
      removeEventListener("keydown", key, true);
      before?.focus?.();
    };
  }, [open, onClose]);
  return panel;
}

function Parts({
  id,
  title,
  description,
  icon,
  badge,
  headerActions,
  footerLeft,
  footerRight,
  showFooter = true,
  bodyClassName = "",
  progress,
  children,
  onClose,
  tight,
}: Common & { id: string; onClose: () => void; tight?: boolean }) {
  return (
    <>
      <header
        className={`relative flex shrink-0 items-center justify-between gap-3 border-b border-line ${tight ? "min-h-12 px-4 py-2" : "min-h-14 px-5 py-2"}`}
      >
        <div className="flex min-w-0 items-center gap-3">
          {icon && <div className="grid size-9 shrink-0 place-items-center rounded-md bg-accent-soft text-accent">{icon}</div>}
          <div className="min-w-0">
            <div className="flex min-w-0 items-center gap-2">
              <h2 id={id} className="truncate font-display text-lg leading-tight">
                {title}
              </h2>
              {badge}
            </div>
            {description && <p className="truncate text-xs text-muted">{description}</p>}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {headerActions}
          <button
            onClick={onClose}
            aria-label="Close"
            className="grid size-8 place-items-center rounded-md text-muted hover:bg-accent-soft hover:text-ink"
          >
            <X size={16} />
          </button>
        </div>
        {progress != null && (
          <div
            className="absolute inset-x-0 bottom-[-1px] h-0.5 bg-line"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress * 100)}
            aria-label="Setup progress"
          >
            <div className="h-full bg-accent transition-[width] duration-500" style={{ width: `${progress * 100}%` }} />
          </div>
        )}
      </header>
      <div className={`min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-paper/50 ${bodyClassName}`}>{children}</div>
      {showFooter && (footerLeft || footerRight) && (
        <footer className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-line px-4 py-2.5">
          <div className="flex min-w-0 items-center gap-2">{footerLeft}</div>
          <div className="flex items-center gap-2">{footerRight}</div>
        </footer>
      )}
    </>
  );
}

const MIN_SHEET = 300; // dragging narrower than this and letting go hides the sheet

/** Right-side sheet. Drag its edge to widen or narrow it, double-click the edge to switch between default and wide, drag below the minimum to hide it. */
export function SheetShell({ width = 520, side = "right", ...p }: Common & { width?: number; side?: "right" | "left" }) {
  const id = useId();
  const close = () => p.onOpenChange(false);
  const panel = useModal(p.open, close);
  const [custom, setCustom] = useState<number | null>(null);
  const [drag, setDrag] = useState<"none" | "ok" | "hide">("none");
  useEffect(() => {
    try {
      const v = Number(localStorage.getItem("mzizi-demo-sheet-w"));
      if (v) setCustom(v);
    } catch {}
  }, []);
  if (!p.open || typeof document === "undefined") return null;
  const GAP = 12; // margin to the screen edge
  const max = () => innerWidth - GAP * 2;
  const w = Math.min(custom ?? width, max());
  const fromX = (x: number) => (side === "right" ? innerWidth - GAP - x : x - GAP);
  const onMove = (e: React.PointerEvent) => {
    if (drag === "none") return;
    const next = fromX(e.clientX);
    setCustom(Math.max(120, Math.min(max(), next)));
    setDrag(next < MIN_SHEET ? "hide" : "ok");
  };
  const onUp = () => {
    if (drag === "hide") {
      setCustom(null);
      setDrag("none");
      close();
      return;
    }
    setDrag("none");
    try {
      if (custom) localStorage.setItem("mzizi-demo-sheet-w", String(Math.round(custom)));
    } catch {}
  };
  const toggleWide = () => {
    const next = w < max() * 0.8 ? Math.min(max(), 960) : width;
    setCustom(next);
    try {
      localStorage.setItem("mzizi-demo-sheet-w", String(next));
    } catch {}
  };
  const key = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") setCustom(Math.min(max(), w + 40));
    if (e.key === "ArrowRight") {
      w - 40 < MIN_SHEET ? close() : setCustom(w - 40);
    }
  };
  return createPortal(
    <div className="fixed inset-0 z-[70]">
      <div className="absolute inset-0 bg-black/35 backdrop-blur-sm" onMouseDown={close} aria-hidden />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={id}
        tabIndex={-1}
        style={{ width: w, transition: drag === "none" ? "width .15s" : "none" }}
        className={`floating absolute inset-y-3 flex flex-col overflow-hidden rounded-xl border border-line bg-surface outline-none ${side === "right" ? "right-3" : "left-3"} ${drag === "hide" ? "opacity-60" : ""}`}
      >
        <div
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize panel. Drag, or use the arrow keys; narrower than the minimum hides it"
          tabIndex={0}
          onPointerDown={(e) => {
            (e.target as Element).setPointerCapture(e.pointerId);
            setDrag("ok");
          }}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onDoubleClick={toggleWide}
          onKeyDown={key}
          className={`absolute inset-y-0 z-10 w-2 cursor-col-resize hover:bg-accent/40 focus-visible:bg-accent/60 ${side === "right" ? "left-0" : "right-0"} ${drag !== "none" ? "bg-accent/50" : ""}`}
        />
        <Parts
          {...p}
          id={id}
          onClose={close}
          tight
          headerActions={
            <>
              {p.headerActions}
              <button
                onClick={toggleWide}
                aria-label={w < max() * 0.8 ? "Expand panel" : "Shrink panel"}
                title="Expand or shrink"
                className="grid size-8 place-items-center rounded-md text-muted hover:bg-accent-soft hover:text-ink"
              >
                {w < max() * 0.8 ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
              </button>
            </>
          }
        />
        {drag === "hide" && (
          <div className="pointer-events-none absolute inset-x-0 bottom-16 text-center text-xs text-muted">Release to hide</div>
        )}
      </div>
    </div>,
    document.body,
  );
}

export function DialogShell({
  maxWidth = "max-w-xl",
  panelClassName = "",
  ...p
}: Common & { maxWidth?: string; panelClassName?: string }) {
  const id = useId();
  const close = () => p.onOpenChange(false);
  const panel = useModal(p.open, close);
  if (!p.open || typeof document === "undefined") return null;
  return createPortal(
    <div className="fixed inset-0 z-[70] grid place-items-center p-4">
      <div className="absolute inset-0 bg-black/35 backdrop-blur-sm" onMouseDown={close} aria-hidden />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={id}
        tabIndex={-1}
        className={`floating relative flex max-h-[90vh] w-full flex-col overflow-hidden rounded-xl border border-line bg-surface outline-none ${maxWidth} ${panelClassName}`}
      >
        <Parts {...p} id={id} onClose={close} />
      </div>
    </div>,
    document.body,
  );
}

export const buttonClass = {
  primary: "rounded-md bg-accent px-3.5 py-2 text-sm font-medium text-paper hover:opacity-90",
  outline: "rounded-md border border-line px-3.5 py-2 text-sm hover:bg-accent-soft",
};
