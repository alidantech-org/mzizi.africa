/** The page frame: a title and its sections, spaced and coloured by the generated theme roles. */
import type { ReactNode } from "react";

export interface PageShellProps {
  readonly title: string;
  readonly children: ReactNode;
}

export function PageShell({ title, children }: PageShellProps) {
  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <h1 className="font-display text-3xl text-content-primary">{title}</h1>
      <div className="mt-6 flex flex-col gap-6">{children}</div>
    </main>
  );
}

export interface SectionProps {
  readonly title?: string;
  readonly children: ReactNode;
}

/** A raised block of a page. */
export function Section({ title, children }: SectionProps) {
  return (
    <section className="rounded-[var(--radius)] border border-border-default bg-surface-elevated p-5 shadow-[var(--shadow)]">
      {title === undefined ? null : (
        <h2 className="mb-3 font-display text-lg text-content-primary">{title}</h2>
      )}
      {children}
    </section>
  );
}
