"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import type { NavGroup } from "./types.ts";

/** Whether a link is the current page or an ancestor of it. The home link matches only the home page. */
export function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * The sidebar: a context block on top (country and place), grouped links, and a foot for legal and help links.
 * It is a drawer on small screens; the shell opens and closes it.
 */
export function Sidebar({
  groups,
  top,
  foot,
  open,
  onNavigate,
  label = "Main",
}: {
  groups: readonly NavGroup[];
  top?: ReactNode;
  foot?: ReactNode;
  open: boolean;
  onNavigate: () => void;
  label?: string;
}) {
  const pathname = usePathname();
  return (
    <aside
      aria-label={label}
      data-open={open}
      className="glass-strong fixed inset-y-0 left-0 z-40 flex w-72 -translate-x-full flex-col overflow-y-auto [scrollbar-width:thin] rounded-none border-y-0 border-l-0 pt-16 transition-transform data-[open=true]:translate-x-0 lg:z-20 lg:translate-x-0"
    >
      {top ? <div className="border-b border-[var(--border-default)] p-4">{top}</div> : null}
      <nav className="flex-1 px-3 py-3">
        {groups.map((group) => (
          <section key={group.id} className="mb-4" aria-labelledby={`nav-${group.id}`}>
            <h2 id={`nav-${group.id}`} className="kicker !font-body px-3 pb-1.5 !text-[0.65rem]">{group.label}</h2>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      aria-current={active ? "page" : undefined}
                      data-active={active}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-semibold text-content-muted transition-colors hover:bg-surface-sunken hover:text-content-primary data-[active=true]:bg-surface-sunken data-[active=true]:text-clay"
                    >
                      {item.icon}
                      <span className="truncate">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </nav>
      {foot ? <div className="border-t border-[var(--border-default)] p-4 text-xs text-content-muted">{foot}</div> : null}
    </aside>
  );
}
