"use client";
/** On narrow screens the top-bar actions (language, appearance, saved places, help) fold into one menu button. */
import { Menu } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { copy } from "@mzizi/copy";
import { useCopy } from "#/lib/copy/copy";

export function AppbarMenu({ children }: { children: ReactNode }) {
  const t = useCopy();
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 48, right: 8 });
  const button = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    addEventListener("keydown", esc);
    return () => removeEventListener("keydown", esc);
  }, [open]);
  const show = () => {
    const r = button.current!.getBoundingClientRect();
    setPos({ top: r.bottom + 8, right: Math.max(8, innerWidth - r.right) });
    setOpen(true);
  };
  const label = t(copy.menus.help.label);
  const panel = open && (
    <>
      <div className="fixed inset-0 z-[55]" onMouseDown={() => setOpen(false)} />
      <div
        role="menu"
        aria-label={label}
        style={{ top: pos.top, right: pos.right }}
        className="floating fixed z-[56] flex items-center gap-1.5 rounded-lg border border-line bg-surface p-1.5"
      >
        {children}
      </div>
    </>
  );
  return (
    <>
      <button
        ref={button}
        onClick={() => (open ? setOpen(false) : show())}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={label}
        title={label}
        className="grid size-9 place-items-center rounded-md text-muted hover:bg-accent-soft hover:text-ink"
      >
        <Menu size={18} />
      </button>
      {typeof document !== "undefined" && panel && createPortal(panel, document.body)}
    </>
  );
}
