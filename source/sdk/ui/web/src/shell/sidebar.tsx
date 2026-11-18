"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";

import type { NavGroup, NavItem } from "./types.ts";

/** Whether a link is the current page or an ancestor of it. The home link matches only the home page. */
export function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function Item({ item, pathname, onNavigate }: { item: NavItem; pathname: string; onNavigate: () => void }) {
  const active = isActive(pathname, item.href);
  return (
    <li>
      <Link
        href={item.href}
        onClick={onNavigate}
        aria-current={active ? "page" : undefined}
        data-active={active}
        className="flex min-h-9 items-center gap-2.5 rounded-lg px-2.5 text-[0.84rem] font-medium text-content-muted transition-colors hover:bg-black/[0.045] hover:text-content-primary data-[active=true]:bg-black/[0.07] data-[active=true]:text-content-primary dark:hover:bg-white/[0.06] dark:data-[active=true]:bg-white/[0.1]"
      >
        <span className="grid h-5 w-5 shrink-0 place-items-center opacity-80">{item.icon}</span>
        <span className="truncate">{item.label}</span>
      </Link>
    </li>
  );
}

/**
 * The sidebar: full height down the left edge. From the top: logo, the place context, a short list of main links, a
 * "More" control that reveals the rest, and a foot for preferences and legal links. A drawer on small screens.
 */
export function Sidebar({
  groups,
  logo,
  top,
  foot,
  open,
  onNavigate,
  label = "Main",
  moreLabel = "More",
  lessLabel = "Less",
}: {
  groups: readonly NavGroup[];
  logo?: ReactNode;
  top?: ReactNode;
  foot?: ReactNode;
  open: boolean;
  onNavigate: () => void;
  label?: string;
  moreLabel?: string;
  lessLabel?: string;
}) {
  const pathname = usePathname();
  const primary = groups.filter((group) => !group.more).flatMap((group) => group.items);
  const more = groups.filter((group) => group.more);
  const inMore = more.some((group) => group.items.some((item) => isActive(pathname, item.href)));
  const [expanded, setExpanded] = useState(false);
  const showMore = expanded || inMore;
  return (
    <aside
      aria-label={label}
      data-open={open}
      className="fixed inset-y-0 left-0 z-40 flex h-dvh w-[17rem] -translate-x-full flex-col border-r border-[var(--border-default)] bg-surface-sunken transition-transform duration-200 data-[open=true]:translate-x-0 lg:sticky lg:top-0 lg:z-20 lg:translate-x-0"
    >
      <div className="flex h-14 shrink-0 items-center px-4">{logo}</div>
      {top ? <div className="px-3 pb-3">{top}</div> : null}
      <nav className="min-h-0 flex-1 overflow-y-auto px-3 pb-3 [scrollbar-width:thin]">
        <ul className="space-y-0.5">
          {primary.map((item) => <Item key={item.href} item={item} pathname={pathname} onNavigate={onNavigate} />)}
        </ul>
        {more.length > 0 ? (
          <div className="mt-2">
            {showMore ? (
              <div id="nav-more" className="space-y-3 pt-1">
                {more.map((group) => (
                  <section key={group.id} aria-labelledby={`nav-${group.id}`}>
                    <h2 id={`nav-${group.id}`} className="px-2.5 pb-1 pt-2 text-[0.68rem] font-semibold uppercase tracking-wider text-content-muted/80">{group.label}</h2>
                    <ul className="space-y-0.5">
                      {group.items.map((item) => <Item key={item.href} item={item} pathname={pathname} onNavigate={onNavigate} />)}
                    </ul>
                  </section>
                ))}
              </div>
            ) : null}
            {inMore ? null : (
              <button
                type="button"
                aria-expanded={showMore}
                aria-controls="nav-more"
                onClick={() => setExpanded((value) => !value)}
                className="mt-1 flex min-h-9 w-full items-center gap-2.5 rounded-lg px-2.5 text-[0.84rem] font-medium text-content-muted transition-colors hover:bg-black/[0.045] hover:text-content-primary dark:hover:bg-white/[0.06]"
              >
                <span aria-hidden="true" className="grid h-5 w-5 place-items-center text-base leading-none">{showMore ? "−" : "···"}</span>
                {showMore ? lessLabel : moreLabel}
              </button>
            )}
          </div>
        ) : null}
      </nav>
      {foot ? <div className="shrink-0 border-t border-[var(--border-default)] p-3 text-xs text-content-muted">{foot}</div> : null}
    </aside>
  );
}
