"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { LanguageSwitcher } from "#/components/site/language-switcher.tsx";
import { useLanguage, type Word } from "#/lib/site/i18n.tsx";
import { useSaved } from "#/lib/site/saved.tsx";
import { routes } from "#/lib/dryv/routes.ts";

/** The links of the top bar. Paths come from the Dryv-generated route table so a renamed view cannot leave a dead link. */
const LINKS: readonly { readonly href: string; readonly word: Word }[] = [
  { href: routes.placeSearch, word: "navPlaces" },
  { href: routes.sourceBrowse, word: "navSources" },
  { href: "/saved", word: "navSaved" },
];

export function SiteHeader() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const { count } = useSaved();
  return (
    <header className="sticky top-0 z-20 border-b border-border-default bg-surface-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-5 py-3">
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-2xl text-content-primary"
        >
          <span
            aria-hidden
            className="grid h-9 w-9 place-items-center rounded-full bg-clay text-cream"
          >
            M
          </span>
          Mzizi
        </Link>
        <nav className="flex flex-1 items-center gap-1">
          {LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                  active
                    ? "bg-clay text-cream"
                    : "text-content-muted hover:bg-surface-sunken hover:text-content-primary"
                }`}
              >
                {t(link.word)}
                {link.href === "/saved" && count > 0 ? (
                  <span className="ml-1.5 rounded-full bg-calabash px-1.5 text-[10px] font-bold text-ink">
                    {count}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>
        <LanguageSwitcher />
      </div>
    </header>
  );
}
