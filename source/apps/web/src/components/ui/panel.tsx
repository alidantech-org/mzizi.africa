/** Card surface and headline figure used across the dashboard. */
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { ReadSection } from "#/components/accessibility/read-section";

const slug = (t: string) =>
  t
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export function Panel({
  title,
  note,
  icon: Icon,
  children,
  className = "",
}: {
  title: string;
  note?: string;
  icon?: LucideIcon;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={slug(title)} data-section className={`scroll-mt-4 rounded-lg border border-line bg-surface p-6 ${className}`}>
      <header className="mb-4 flex items-baseline justify-between gap-4">
        <h2 className="flex items-center gap-2.5 font-display text-xl tracking-tight">
          {Icon && <Icon size={18} className="text-accent" />}
          {title}
        </h2>
        <span className="flex items-center gap-2">
          {note && <span className="font-mono text-[11px] uppercase tracking-widest text-muted">{note}</span>}
          <ReadSection />
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
  delta: string;
  tone: "c1" | "c2" | "c3" | "c4";
  icon: LucideIcon;
}) {
  const color = { c1: "text-c1 bg-c1/12", c2: "text-c2 bg-c2/12", c3: "text-c3 bg-c3/15", c4: "text-c4 bg-c4/12" }[tone];
  return (
    <div className="rounded-lg border border-line bg-surface p-6">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-widest text-muted">{label}</span>
        <span className={`grid size-9 place-items-center rounded-lg ${color}`}>
          <Icon size={18} />
        </span>
      </div>
      <div className="mt-3 font-display text-5xl tracking-tight">{value}</div>
      <div className="mt-1 text-sm text-muted">{delta}</div>
    </div>
  );
}
