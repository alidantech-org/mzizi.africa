/** Card surface and headline figure used across the place views. */
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function Panel({
  id,
  title,
  note,
  icon: Icon,
  children,
  className = "",
}: {
  /** A stable section id, used in the address after # so a copied link opens at this panel. */
  id: string;
  title: string;
  note?: string;
  icon?: LucideIcon;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} data-section className={`scroll-mt-4 rounded-lg border border-line bg-surface p-6 ${className}`}>
      <header className="mb-4 flex items-baseline justify-between gap-4">
        <h2 className="flex min-w-0 flex-1 items-center gap-2.5 font-display text-xl tracking-tight">
          {Icon && <Icon size={18} className="shrink-0 text-accent" />}
          <span className="min-w-0 truncate">{title}</span>
        </h2>
        <span className="flex min-w-0 max-w-[45%] shrink items-center gap-2">
          {note && <span className="min-w-0 truncate font-mono text-[11px] uppercase tracking-widest text-muted">{note}</span>}
        </span>
      </header>
      {children}
    </section>
  );
}

export function Kpi({
  label,
  value,
  delta,
  tone,
  icon: Icon,
}: {
  label: string;
  value: string;
  delta?: string;
  tone: "c1" | "c2" | "c3" | "c4";
  icon: LucideIcon;
}) {
  const color = { c1: "text-c1 bg-c1/12", c2: "text-c2 bg-c2/12", c3: "text-c3 bg-c3/15", c4: "text-c4 bg-c4/12" }[tone];
  return (
    <div className="min-w-0 rounded-lg border border-line bg-surface p-6">
      <div className="flex items-center justify-between gap-2">
        <span className="min-w-0 truncate font-mono text-[11px] uppercase tracking-widest text-muted">{label}</span>
        <span className={`grid size-9 shrink-0 place-items-center rounded-lg ${color}`}>
          <Icon size={18} />
        </span>
      </div>
      <div className="mt-3 truncate font-display text-5xl tracking-tight">{value}</div>
      {delta && <div className="mt-1 truncate text-sm text-muted">{delta}</div>}
    </div>
  );
}
