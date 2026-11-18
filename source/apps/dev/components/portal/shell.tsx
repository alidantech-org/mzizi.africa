"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { health } from "#/lib/portal/engine.ts";
import { useAsync } from "#/lib/portal/use-async.ts";
import { routes } from "#/lib/dryv/routes.ts";

/** The sidebar entries: paths come from the Dryv route table, icons and grouping are the portal's own. */
const SECTIONS: readonly {
  readonly title: string;
  readonly items: readonly { href: string; label: string; icon: string }[];
}[] = [
  {
    title: "Engine",
    items: [
      { href: "/", label: "Overview", icon: "◧" },
      { href: routes.capabilityList, label: "Capabilities", icon: "⚙" },
      { href: "/runs", label: "Runs", icon: "▶" },
      { href: routes.jobList, label: "Jobs (table)", icon: "☰" },
    ],
  },
  {
    title: "Work",
    items: [
      { href: "/runs/new", label: "New run", icon: "＋" },
      { href: "/files", label: "Files & viewers", icon: "🗂" },
      { href: "/csv", label: "CSV preparation", icon: "✎" },
    ],
  },
  {
    title: "Data",
    items: [
      { href: "/database", label: "Database", icon: "◈" },
      { href: routes.seedTableList, label: "Seed tables", icon: "▤" },
      { href: "/knowledge", label: "Terms & knowledge", icon: "✦" },
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
    <div className="min-h-screen md:grid md:grid-cols-[16rem_1fr]">
      <aside className="border-b border-border-default bg-surface-elevated md:sticky md:top-0 md:h-screen md:border-b-0 md:border-r">
        <div className="flex items-center gap-3 px-5 py-5">
          <span
            aria-hidden
            className="grid h-9 w-9 place-items-center rounded-xl bg-clay font-display text-cream"
          >
            M
          </span>
          <div className="leading-tight">
            <p className="font-display text-lg">Mzizi</p>
            <p className="text-xs text-content-muted">Developer portal</p>
          </div>
        </div>
        <nav className="flex gap-4 overflow-x-auto px-3 pb-4 md:block md:space-y-6 md:overflow-visible">
          {SECTIONS.map((section) => (
            <div key={section.title} className="min-w-max md:min-w-0">
              <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-widest text-content-muted">
                {section.title}
              </p>
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
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                          active
                            ? "bg-clay text-cream"
                            : "text-content-primary hover:bg-surface-sunken"
                        }`}
                      >
                        <span aria-hidden className="w-4 text-center">
                          {item.icon}
                        </span>
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
      <div className="min-w-0">
        <header className="flex items-center justify-between gap-4 border-b border-border-default px-6 py-4">
          <h1 className="text-xl">{current?.label ?? "Developer portal"}</h1>
          <StatusPill />
        </header>
        <main className="min-w-0 px-4 py-5 md:px-6">{children}</main>
      </div>
    </div>
  );
}
