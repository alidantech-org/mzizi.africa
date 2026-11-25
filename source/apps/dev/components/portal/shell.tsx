"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { Icon, type IconName } from "#/components/brand/icon.tsx";
import { Logo } from "#/components/brand/logo.tsx";
import { ThemeToggle } from "#/components/portal/theme-toggle.tsx";
import { health } from "#/lib/portal/engine.ts";
import { useAsync } from "#/lib/portal/use-async.ts";
import { routes } from "#/lib/dryv/routes.ts";

/** The sidebar entries: paths come from the Dryv route table, icons and grouping are the portal's own. */
const SECTIONS: readonly {
  readonly title: string;
  readonly items: readonly { href: string; label: string; icon: IconName }[];
}[] = [
  {
    title: "Engine",
    items: [
      { href: "/", label: "Overview", icon: "home" },
      { href: routes.capabilityList, label: "Capabilities", icon: "build" },
      { href: "/runs", label: "Runs", icon: "play" },
      { href: routes.jobList, label: "Jobs (table)", icon: "calendar" },
    ],
  },
  {
    title: "Work",
    items: [
      { href: "/runs/new", label: "New run", icon: "plus" },
      { href: "/files", label: "Files & viewers", icon: "document" },
      { href: "/csv", label: "CSV preparation", icon: "swap" },
    ],
  },
  {
    title: "Data",
    items: [
      { href: "/database", label: "Database", icon: "chart" },
      { href: "/knowledge", label: "Terms & knowledge", icon: "bulb" },
    ],
  },
];

function StatusPill() {
  const loaded = useAsync(health, "health");
  const ok = loaded.state === "ready" && loaded.value.status === "ok";
  const label =
    loaded.state === "loading" ? "Checking engine…" : ok ? "Engine online" : "Engine unreachable";
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border-default bg-surface-elevated px-3 py-1 text-xs font-medium">
      <span
        className={`h-2 w-2 rounded-full ${loaded.state === "loading" ? "bg-calabash" : ok ? "bg-raffia" : "bg-danger"}`}
      />
      {label}
    </span>
  );
}

export function PortalShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const current =
    SECTIONS.flatMap((section) => section.items).find((item) => item.href === pathname) ??
    SECTIONS.flatMap((section) => section.items)
      .filter((item) => item.href !== "/" && pathname.startsWith(item.href))
      .sort((a, b) => b.href.length - a.href.length)[0];
  return (
    <div className="min-h-screen">
      <header className="glass-strong sticky top-0 z-30 border-x-0 border-t-0">
        <div className="mx-auto flex h-16 w-full max-w-[110rem] items-center justify-between gap-4 px-5">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="hidden h-6 w-px bg-border-default sm:block" aria-hidden />
            <span className="hidden text-sm font-semibold text-content-muted sm:block">Developer portal</span>
          </div>
          <h1 className="hidden flex-1 truncate text-center text-lg md:block">{current?.label ?? "Developer portal"}</h1>
          <div className="flex items-center gap-2">
            <StatusPill />
            <ThemeToggle />
          </div>
        </div>
      </header>
      <div className="mx-auto md:grid md:max-w-[110rem] md:grid-cols-[15rem_1fr]">
        <aside className="border-b border-border-default md:sticky md:top-16 md:h-[calc(100vh-4rem)] md:self-start md:overflow-y-auto md:border-b-0 md:border-r">
          <nav aria-label="Portal" className="flex gap-4 overflow-x-auto px-3 py-4 md:block md:space-y-6 md:overflow-visible">
            {SECTIONS.map((section) => (
              <div key={section.title} className="min-w-max md:min-w-0">
                <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-widest text-content-muted">{section.title}</p>
                <ul className="flex gap-1 md:block md:space-y-0.5">
                  {section.items.map((item) => {
                    const active = item.href === "/" ? pathname === "/" : pathname === item.href ||
                      (item.href === "/runs" && pathname.startsWith("/runs/") && pathname !== "/runs/new") ||
                      (item.href !== "/runs" && pathname.startsWith(`${item.href}/`));
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          aria-current={active ? "page" : undefined}
                          className={`flex items-center gap-3 rounded-full px-3.5 py-2 text-sm font-medium transition ${active ? "bg-clay text-cream" : "text-content-primary hover:bg-surface-sunken"}`}
                        >
                          <Icon name={item.icon} size={18} />
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </aside>
        <main className="min-w-0 px-4 py-5 md:px-6">{children}</main>
      </div>
    </div>
  );
}
