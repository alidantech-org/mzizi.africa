"use client";

import { useState, type ReactNode } from "react";

import { Breadcrumbs } from "./breadcrumbs.tsx";
import { Sidebar } from "./sidebar.tsx";
import type { Crumb, NavGroup } from "./types.ts";

/**
 * The application frame: a full-height sidebar on the left; on the right an app bar (breadcrumbs, search and actions)
 * over the page. There is no page footer. Everything it shows is passed in, so it knows no country, place or word.
 */
export function AppShell({
  logo,
  groups,
  crumbs,
  search,
  actions,
  sidebarTop,
  sidebarFoot,
  menuLabel = "Menu",
  moreLabel,
  lessLabel,
  breadcrumbLabel,
  children,
}: {
  logo: ReactNode;
  groups: readonly NavGroup[];
  crumbs: readonly Crumb[];
  search?: ReactNode;
  actions?: ReactNode;
  sidebarTop?: ReactNode;
  sidebarFoot?: ReactNode;
  menuLabel?: string;
  moreLabel?: string;
  lessLabel?: string;
  breadcrumbLabel?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex min-h-dvh">
      <Sidebar groups={groups} logo={logo} top={sidebarTop} foot={sidebarFoot} open={open} onNavigate={() => setOpen(false)} moreLabel={moreLabel} lessLabel={lessLabel} />
      {open ? <button type="button" aria-label={menuLabel} className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setOpen(false)} /> : null}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-[var(--border-default)] bg-surface-background/90 px-3 backdrop-blur sm:px-5">
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-lg text-content-primary hover:bg-black/[0.05] lg:hidden dark:hover:bg-white/[0.08]"
            aria-expanded={open}
            aria-label={menuLabel}
            onClick={() => setOpen((value) => !value)}
          >
            <span aria-hidden="true" className="text-xl leading-none">{open ? "×" : "☰"}</span>
          </button>
          <div className="min-w-0 flex-1"><Breadcrumbs crumbs={crumbs} label={breadcrumbLabel} /></div>
          <div className="flex shrink-0 items-center gap-1.5">
            {search ? <div className="hidden w-60 xl:block">{search}</div> : null}
            {actions}
          </div>
        </header>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
