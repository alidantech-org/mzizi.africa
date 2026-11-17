"use client";

/** Home page at `/`. Scaffolded by Dryv once; this file belongs to the app. */
import Link from "next/link";

import { LocateButton } from "#/components/site/locate-button.tsx";
import { PlaceSearchBox } from "#/components/site/place-search-box.tsx";
import { useLanguage } from "#/lib/site/i18n.tsx";
import { routes } from "#/lib/dryv/routes.ts";

export default function HomePage() {
  const { t } = useLanguage();
  return (
    <div>
      <section className="border-b border-border-default bg-gradient-to-b from-surface-sunken/70 to-transparent">
        <div className="mx-auto max-w-4xl px-5 py-20 text-center sm:py-28">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-clay">Mzizi</p>
          <h1 className="mt-4 text-4xl leading-tight sm:text-6xl">{t("heroTitle")}</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-content-muted">{t("heroBody")}</p>
          <div className="mt-9 flex flex-col items-center gap-6">
            <LocateButton />
            <div className="w-full max-w-xl">
              <PlaceSearchBox />
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl gap-5 px-5 py-14 sm:grid-cols-3">
        {[
          { title: t("representatives"), body: t("tagline"), href: routes.placeSearch, mark: "①" },
          { title: t("procurement"), body: t("totalAwarded"), href: routes.placeSearch, mark: "②" },
          { title: t("sources"), body: t("sourcesBody"), href: routes.sourceBrowse, mark: "③" },
        ].map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="group rounded-[var(--radius)] border border-border-default bg-surface-elevated p-6 shadow-[var(--shadow)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"
          >
            <span aria-hidden className="text-2xl text-calabash">
              {card.mark}
            </span>
            <h2 className="mt-3 text-xl">{card.title}</h2>
            <p className="mt-2 text-sm text-content-muted">{card.body}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
