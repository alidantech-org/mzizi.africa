/** Heading block of a page: a small label, the title, an optional introduction and optional actions. */
import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  children,
  actions,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <header className="mb-8 flex flex-wrap items-end justify-between gap-6">
      <div className="min-w-0 max-w-3xl">
        <p className="truncate font-mono text-[11px] uppercase tracking-[0.22em] text-accent">{eyebrow}</p>
        <h1 className="mt-3 font-display text-4xl leading-[1.05] tracking-tight md:text-5xl">{title}</h1>
        {children && <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">{children}</p>}
      </div>
      {actions}
    </header>
  );
}
