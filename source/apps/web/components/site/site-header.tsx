"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { GlobalSearchBox } from "#/components/site/global-search-box.tsx";
import { LanguageSwitcher } from "#/components/site/language-switcher.tsx";
import { useLanguage, type Word } from "#/lib/site/i18n.tsx";
import { useSaved } from "#/lib/site/saved.tsx";
import { routes } from "#/lib/dryv/routes.ts";

/** The sections of the site. Paths that exist in the Dryv route table come from it; the rest are the app's own pages. */
const LINKS: readonly { readonly href: string; readonly word: Word; readonly match: string }[] = [
  { href: "/browse", word: "navPlaces", match: "/browse" },
  { href: "/statistics", word: "navStats", match: "/statistics" },
  { href: "/elections", word: "navElections", match: "/elections" },
  { href: "/parliament", word: "navParliament", match: "/parliament" },
  { href: "/civic", word: "navCivic", match: "/civic" },
  { href: "/leaderboards", word: "navBoards", match: "/leaderboards" },
  { href: "/tenders", word: "navTenders", match: "/tenders" },
];

export function SiteHeader() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const { count } = useSaved();
  const [menu, setMenu] = useState(false);
  return (
    <header className="glass-strong sticky top-0 z-30 rounded-none border-x-0 border-t-0">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2.5 sm:px-5">
        <Link href="/" className="flex shrink-0 items-center gap-2 font-display text-2xl text-content-primary">
          <span aria-hidden className="grid h-9 w-9 place-items-center rounded-2xl bg-gradient-to-br from-clay to-calabash text-cream shadow">M</span>
          <span className="hidden sm:inline">Mzizi</span>
        </Link>
        <div className="min-w-0 flex-1 md:max-w-md"><GlobalSearchBox compact /></div>
        <nav aria-label="Main" className="ml-auto hidden items-center gap-0.5 xl:flex">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="tab" data-active={pathname.startsWith(link.match)} aria-current={pathname.startsWith(link.match) ? "page" : undefined}>
              {t(link.word)}
            </Link>
          ))}
        </nav>
        <Link href="/saved" className="btn btn-ghost !px-3 !py-1.5" aria-label={t("navSaved")}>
          ★{count > 0 ? <span className="rounded-full bg-calabash px-1.5 text-[10px] font-bold text-ink">{count}</span> : null}
        </Link>
        <LanguageSwitcher />
        <button type="button" className="btn btn-ghost !px-3 !py-1.5 xl:hidden" aria-expanded={menu} aria-label="Menu" onClick={() => setMenu(!menu)}>☰</button>
      </div>
      {menu ? (
        <nav aria-label="Main (menu)" className="mx-auto grid max-w-7xl grid-cols-2 gap-1 px-4 pb-3 sm:grid-cols-4 xl:hidden">
          {[...LINKS, { href: "/parties", word: "navParties" as Word, match: "/parties" }, { href: routes.sourceBrowse, word: "navSources" as Word, match: routes.sourceBrowse }].map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setMenu(false)} className="tab text-center" data-active={pathname.startsWith(link.match)}>{t(link.word)}</Link>
          ))}
        </nav>
      ) : null}
    </header>
  );
}
