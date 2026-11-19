/** Small shared interface parts: page header, pills, badges, tags. */
import type { ReactNode } from "react";

export function PageHeader({ eyebrow, title, children, actions }: { eyebrow: string; title: string; children?: ReactNode; actions?: ReactNode }) {
  return (
    <header className="mb-8 flex flex-wrap items-end justify-between gap-6">
      <div className="max-w-3xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent">{eyebrow}</p>
        <h1 className="mt-3 font-display text-4xl leading-[1.05] tracking-tight md:text-5xl">{title}</h1>
        {children && <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">{children}</p>}
      </div>
      {actions}
    </header>
  );
}

export type Role = "elected" | "nominated" | "appointed" | "exofficio";
const roleStyle: Record<Role, { label: string; cls: string; mark: string }> = {
  elected: { label: "Elected", cls: "bg-c2/15 text-c2", mark: "●" },
  nominated: { label: "Nominated", cls: "bg-c4/15 text-c4", mark: "◆" },
  appointed: { label: "Appointed", cls: "bg-c3/20 text-ink", mark: "■" },
  exofficio: { label: "Ex officio", cls: "bg-line text-muted", mark: "○" },
};
export const roles = roleStyle;

export function RoleBadge({ role }: { role: Role }) {
  const r = roleStyle[role];
  return <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-medium ${r.cls}`}><span aria-hidden>{r.mark}</span>{r.label}</span>;
}

export function RoleLegend() {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted">
      {(Object.keys(roleStyle) as Role[]).map((k) => (
        <span key={k} className="flex items-center gap-2"><RoleBadge role={k} />{{ elected: "chosen by voters", nominated: "named, then confirmed", appointed: "chosen by an authority", exofficio: "seat comes with another office" }[k]}</span>
      ))}
    </div>
  );
}

export function Chip({ children, tone = "plain" }: { children: ReactNode; tone?: "plain" | "accent" }) {
  return <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs ${tone === "accent" ? "border-transparent bg-accent text-paper" : "border-line bg-surface text-muted"}`}>{children}</span>;
}

/** Marks figures that are placeholders until a real source is loaded. */
export function DemoTag({ children = "Demo figures" }: { children?: ReactNode }) {
  return <span className="inline-flex items-center gap-1.5 rounded-full bg-c3/20 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-ink"><span className="size-1.5 rounded-full bg-c3" />{children}</span>;
}

export function RealTag({ children = "From the seed" }: { children?: ReactNode }) {
  return <span className="inline-flex items-center gap-1.5 rounded-full bg-c2/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-c2"><span className="size-1.5 rounded-full bg-c2" />{children}</span>;
}

export function Note({ children }: { children: ReactNode }) {
  return <p className="mt-6 text-xs leading-relaxed text-muted">{children}</p>;
}
