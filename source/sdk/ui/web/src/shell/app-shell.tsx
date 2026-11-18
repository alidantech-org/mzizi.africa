"use client";

import { useState, type ReactNode } from "react";

import { Breadcrumbs } from "./breadcrumbs.tsx";
import { Sidebar } from "./sidebar.tsx";
import type { Crumb, NavGroup } from "./types.ts";

/**
 * The application frame: an app bar (logo, breadcrumbs, search and actions) over a sidebar and the page. There is no page
 * footer; legal and help links sit at the foot of the sidebar. Everything it shows is passed in, so it knows no country,
 * place or word.
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
  breadcrumbLabel?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-dvh">
      <header className="glass-strong fixed inset-x-0 top-0 z-50 h-16 rounded-none border-x-0 border-t-0">
        <div className="flex h-full items-center gap-3 px-4">
          <div className="lg:hidden">
            <button
              type="button"
              className="btn btn-ghost !h-10 !w-10 !justify-center !p-0"
              aria-expanded={open}
              aria-label={menuLabel}
              onClick={() => setOpen((value) => !value)}
            >
              <span aria-hidden="true" className="text-lg leading-none">{open ? "×" : "☰"}</span>
            </button>
          </div>
          <div className="shrink-0">{logo}</div>
          <div className="hidden min-w-0 flex-1 md:block"><Breadcrumbs crumbs={crumbs} label={breadcrumbLabel} /></div>
          <div className="ml-auto flex items-center gap-2">
            {search ? <div className="hidden w-64 xl:block">{search}</div> : null}
            {actions}
          </div>
        </div>
      </header>
      <Sidebar groups={groups} top={sidebarTop} foot={sidebarFoot} open={open} onNavigate={() => setOpen(false)} />
      {open ? <button type="button" aria-label={menuLabel} className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setOpen(false)} /> : null}
      <div className="pt-16 lg:pl-72">
        <div className="border-b border-[var(--border-default)] px-4 py-2 md:hidden"><Breadcrumbs crumbs={crumbs} label={breadcrumbLabel} /></div>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
