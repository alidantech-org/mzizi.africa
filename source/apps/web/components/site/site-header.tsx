"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Icon, type IconName } from "#/components/brand/icon.tsx";
import { Logo } from "#/components/brand/logo.tsx";
import { GlobalSearchBox } from "#/components/site/global-search-box.tsx";
import { LanguageSwitcher } from "#/components/site/language-switcher.tsx";
import { ThemeToggle } from "#/components/site/theme-toggle.tsx";
import { useLanguage, type Word } from "#/lib/site/i18n.tsx";
import { useSaved } from "#/lib/site/saved.tsx";

interface Section { readonly href: string; readonly word: Word; readonly icon: IconName }
const MAIN: readonly Section[] = [
  { href: "/browse", word: "navPlaces", icon: "pin" },
  { href: "/statistics", word: "navStats", icon: "chart" },
  { href: "/elections", word: "navElections", icon: "vote" },
  { href: "/parliament", word: "navParliament", icon: "parliament" },
  { href: "/leaderboards", word: "navBoards", icon: "trophy" },
];
const MORE: readonly Section[] = [
  { href: "/civic", word: "navCivic", icon: "build" },
  { href: "/leaders", word: "navLeaders", icon: "tree" },
  { href: "/tenders", word: "navTenders", icon: "document" },
  { href: "/parties", word: "navParties", icon: "flag" },
  { href: "/source-browse", word: "navSources", icon: "book" },
];

/** One bar, edge to edge of the page column: mark on the left, sections in the middle, tools on the right. */
export function SiteHeader() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const { count } = useSaved();
  const [menu, setMenu] = useState(false);
  const active = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  return (
    <header className="glass-strong sticky top-0 z-30 rounded-none border-x-0 border-t-0">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-5">
        <Logo />
        <nav aria-label="Main" className="hidden flex-1 items-center justify-center gap-1 xl:flex">
          {MAIN.map((s) => (
            <Link key={s.href} href={s.href} className="tab inline-flex items-center gap-1.5" data-active={active(s.href)} aria-current={active(s.href) ? "page" : undefined}>
              <Icon name={s.icon} size={16} />
              {t(s.word)}
            </Link>
          ))}
          <details className="relative">
            <summary className="tab inline-flex cursor-pointer list-none items-center gap-1 [&::-webkit-details-marker]:hidden">
              More <Icon name="chevron-down" size={14} />
            </summary>
            <ul className="glass-strong absolute right-0 top-full z-40 mt-2 w-52 rounded-2xl p-1.5">
              {MORE.map((s) => (
                <li key={s.href}>
                  <Link href={s.href} className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm hover:bg-surface-sunken"><Icon name={s.icon} size={18} />{t(s.word)}</Link>
                </li>
              ))}
            </ul>
          </details>
        </nav>
        <div className="flex items-center gap-2">
          <div className="hidden w-64 2xl:block"><GlobalSearchBox compact /></div>
          <Link href="/search" className="btn btn-ghost !h-10 !w-10 !justify-center !p-0 2xl:hidden" aria-label="Search"><Icon name="search" /></Link>
          <ThemeToggle />
          <LanguageSwitcher />
          <Link href="/saved" className="btn btn-ghost relative !h-10 !w-10 !justify-center !p-0" aria-label={t("navSaved")}>
            <Icon name="heart" />
            {count > 0 ? <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-calabash px-1 text-[10px] font-bold text-ink">{count}</span> : null}
          </Link>
          <button type="button" className="btn btn-ghost !h-10 !w-10 !justify-center !p-0 xl:hidden" aria-expanded={menu} aria-label="Menu" onClick={() => setMenu(!menu)}>
            <Icon name={menu ? "close" : "menu"} />
          </button>
        </div>
      </div>
      {menu ? (
        <nav aria-label="Main (menu)" className="mx-auto grid max-w-7xl grid-cols-2 gap-2 px-5 pb-4 sm:grid-cols-3 xl:hidden">
          {[...MAIN, ...MORE].map((s) => (
            <Link key={s.href} href={s.href} onClick={() => setMenu(false)} className="glass flex items-center gap-2.5 rounded-2xl px-4 py-3 text-sm font-semibold" data-active={active(s.href)}>
              <Icon name={s.icon} size={18} />{t(s.word)}
            </Link>
          ))}
        </nav>
      ) : null}
    </header>
  );
}
