"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { PlaceChip } from "#/components/shell/place-chip.tsx";
import { Icon, type IconName } from "#/components/brand/icon.tsx";
import { Logo } from "#/components/brand/logo.tsx";
import { GlobalSearchBox } from "#/components/site/global-search-box.tsx";
import { LanguageSwitcher } from "#/components/site/language-switcher.tsx";
import { ThemeToggle } from "#/components/site/theme-toggle.tsx";
import { useLanguage } from "#/lib/site/i18n.tsx";
import { useSaved } from "#/lib/site/saved.tsx";
import { AppShell } from "@mzizi/ui-web/shell/app-shell.tsx";
import type { Crumb, NavGroup } from "@mzizi/ui-web/shell/types.ts";

/** What the server knows about the visitor's place for this address. */
export interface ShellContext {
  readonly countryName: string;
  readonly countryIso?: string | null;
  readonly place: { readonly name: string; readonly kindLabel: string; readonly path: string } | null;
  readonly chain: readonly { readonly name: string; readonly path: string }[];
  readonly rest: readonly string[];
}

interface Entry { readonly href: string; readonly label: string; readonly icon: IconName; readonly scoped?: boolean }

/** The sections of the product, in groups. Section words are the English text; the sidebar shows them in the visitor's language. */
const GROUPS: readonly { readonly id: string; readonly label: string; readonly more?: boolean; readonly items: readonly Entry[] }[] = [
  { id: "main", label: "Main", items: [
    { href: "/", label: "Home", icon: "home" },
    { href: "/explore", label: "Explore", icon: "compare" },
    { href: "/places", label: "Places", icon: "pin" },
    { href: "/elections", label: "Elections", icon: "vote" },
    { href: "/leaders", label: "Leaders", icon: "tree" },
    { href: "/calendar", label: "Calendar", icon: "calendar", scoped: true },
  ] },
  { id: "politics", label: "Politics", more: true, items: [
    { href: "/politics/parties", label: "Parties", icon: "flag" },
    { href: "/politics/coalitions", label: "Coalitions", icon: "flag" },
    { href: "/politics/manifestos", label: "Manifestos", icon: "document" },
    { href: "/government/parliament", label: "Parliament", icon: "parliament" },
  ] },
  { id: "government", label: "Government", more: true, items: [
    { href: "/government/institutions", label: "Institutions", icon: "parliament" },
    { href: "/government/law", label: "Law", icon: "book" },
  ] },
  { id: "money", label: "Public money", more: true, items: [
    { href: "/finance", label: "Finance and projects", icon: "build" },
    { href: "/finance/budgets", label: "Budgets", icon: "document" },
    { href: "/finance/funds", label: "Funds", icon: "build" },
    { href: "/procurement/tenders", label: "Procurement", icon: "document" },
    { href: "/infrastructure", label: "Infrastructure", icon: "build", scoped: true },
  ] },
  { id: "data", label: "Data", more: true, items: [
    { href: "/data/statistics", label: "Statistics", icon: "chart" },
    { href: "/data/rankings", label: "Rankings", icon: "trophy" },
    { href: "/data/compare", label: "Compare", icon: "chart" },
    { href: "/data/sources", label: "Sources", icon: "book" },
    { href: "/data/coverage", label: "Coverage", icon: "chart" },
  ] },
];

function labelFor(segment: string, tr: (text: string) => string): string {
  for (const group of GROUPS) for (const item of group.items) if (item.href === `/${segment}`) return tr(item.label);
  return tr(segment.replace(/-/g, " ").replace(/^./, (c) => c.toUpperCase()));
}

/** The application frame for every page: sidebar of sections, app bar with breadcrumbs, search and tools, no footer. */
export function AppFrame({ context, children }: { context: ShellContext; children: ReactNode }) {
  const { tr } = useLanguage();
  const { count } = useSaved();
  const pathname = usePathname();
  const base = context.place ? `/${context.place.path}` : "";
  const groups: NavGroup[] = GROUPS.map((group) => ({
    id: group.id,
    more: group.more,
    label: tr(group.label),
    items: group.items.map((item) => ({
      href: item.scoped && base ? `${base}${item.href}` : item.href,
      label: tr(item.label),
      icon: <Icon name={item.icon} size={18} />,
    })),
  }));
  const crumbs: Crumb[] = [{ label: context.countryName, href: "/" }];
  for (const unit of context.chain) crumbs.push({ label: unit.name, href: `/${unit.path}` });
  const rest = context.place ? context.rest : pathname.split("/").filter(Boolean);
  rest.forEach((segment, index) => {
    if (index === 0 || index < 2) crumbs.push({ label: labelFor(segment, tr), href: index === rest.length - 1 ? undefined : `${base}/${rest.slice(0, index + 1).join("/")}` });
  });
  return (
    <AppShell
      logo={<Logo />}
      groups={groups}
      crumbs={crumbs}
      menuLabel={tr("Menu")}
      moreLabel={tr("More")}
      lessLabel={tr("Less")}
      breadcrumbLabel={tr("Breadcrumb")}
      search={<GlobalSearchBox compact />}
      actions={
        <>
          <div className="xl:hidden"><Link href="/search" className="btn btn-ghost !h-10 !w-10 !justify-center !p-0" aria-label={tr("Search")}><Icon name="search" /></Link></div>
          <ThemeToggle />
          <div className="hidden sm:block"><LanguageSwitcher /></div>
          <Link href="/me/saved" className="btn btn-ghost relative !h-10 !w-10 !justify-center !p-0" aria-label={tr("Saved")}>
            <Icon name="heart" />
            {count > 0 ? <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-calabash px-1 text-[10px] font-bold text-ink">{count}</span> : null}
          </Link>
          <Link href="/me" className="btn btn-ghost !h-10 !w-10 !justify-center !p-0" aria-label={tr("Profile and preferences")}><Icon name="user" /></Link>
        </>
      }
      sidebarTop={<PlaceChip countryName={context.countryName} countryIso={context.countryIso ?? null} placeName={context.place?.name ?? null} placePath={context.place?.path ?? null} />}
      sidebarFoot={
        <ul className="space-y-1">
          <li><Link href="/me/privacy" className="hover:underline">{tr("Privacy and preferences")}</Link></li>
          <li><Link href="/data/sources" className="hover:underline">{tr("Data sources and licences")}</Link></li>
          <li><Link href="/help" className="hover:underline">{tr("Help")}</Link></li>
        </ul>
      }
    >
      {children}
    </AppShell>
  );
}
