"use client";
/**
 * Shared shells for every sheet and dialog, following the RideRescue shell concept:
 * header (icon, title, badge, description, actions) / scrollable body / footer (left and right).
 */
import { copy } from "@mzizi/copy";
import { useCopy } from "#/lib/copy/copy";
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
  const t = useCopy();
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
            aria-label={t(copy.common.close)}
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
            aria-label={t(copy.setup.progress)}
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
      <div className="absolute inset-0 bg-black/35 backdrop-blur-sm" onPointerDown={close} aria-hidden />
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
  primary: "max-w-full truncate rounded-md bg-accent px-3.5 py-2 text-sm font-medium text-paper hover:opacity-90",
  outline: "max-w-full truncate rounded-md border border-line px-3.5 py-2 text-sm hover:bg-accent-soft",
};
