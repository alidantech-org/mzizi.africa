"use client";

/** Home page at `/`. Scaffolded by Dryv once; this file belongs to the app. */
import Link from "next/link";

import { LocateButton } from "#/components/site/locate-button.tsx";
import { PlaceSearchBox } from "#/components/site/place-search-box.tsx";
import { useLanguage } from "#/lib/site/i18n.tsx";
import { useSaved } from "#/lib/site/saved.tsx";
import { routes } from "#/lib/dryv/routes.ts";

export default function HomePage() {
  const { t } = useLanguage();
  const saved = useSaved();
  return (
    <div>
      <section className="pattern-bg relative overflow-hidden border-b border-border-default">
        <div
          aria-hidden
          className="drift pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-calabash/25 blur-3xl"
        />
        <div
          aria-hidden
          className="drift pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-clay/25 blur-3xl [animation-delay:-3s]"
        />
        <div className="relative mx-auto max-w-4xl px-5 py-20 text-center sm:py-28">
          <p className="reveal text-sm font-semibold uppercase tracking-[0.2em] text-clay">Mzizi</p>
          <h1 className="reveal reveal-1 mt-4 text-4xl leading-tight sm:text-6xl">
            {t("heroTitle")}
          </h1>
          <p className="reveal reveal-2 mx-auto mt-5 max-w-2xl text-lg text-content-muted">
            {t("heroBody")}
          </p>
          <div className="reveal reveal-3 mt-9 flex flex-col items-center gap-6">
            <LocateButton />
            <div className="w-full max-w-xl">
              <PlaceSearchBox />
            </div>
          </div>
        </div>
      </section>
      {saved.places.length + saved.spots.length > 0 ? (
        <section className="reveal mx-auto max-w-6xl px-5 pt-10">
          <h2 className="mb-3 text-lg">{t("myPlaces")}</h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {saved.places.map((place) => (
              <Link
                key={place.id}
                href={`${routes.placeProfile}?featureId=${place.id}`}
                className="shrink-0 rounded-full border border-border-default bg-surface-elevated px-5 py-2 text-sm shadow-[var(--shadow)] transition hover:border-clay"
              >
                ★ {place.name}
              </Link>
            ))}
            {saved.spots.map((spot) => (
              <Link
                key={spot.id}
                href={`${routes.placeProfile}?lat=${spot.latitude}&lng=${spot.longitude}`}
                className="shrink-0 rounded-full border border-border-default bg-surface-elevated px-5 py-2 text-sm shadow-[var(--shadow)] transition hover:border-raffia"
              >
                ◎ {spot.label}
              </Link>
            ))}
          </div>
        </section>
      ) : null}
      <section className="mx-auto grid max-w-6xl gap-5 px-5 py-14 sm:grid-cols-3">
        {[
          { title: t("representatives"), body: t("tagline"), href: routes.placeSearch, mark: "①" },
          { title: t("procurement"), body: t("totalAwarded"), href: routes.placeSearch, mark: "②" },
          { title: t("sources"), body: t("sourcesBody"), href: routes.sourceBrowse, mark: "③" },
        ].map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="reveal reveal-4 group rounded-[var(--radius)] border border-border-default bg-surface-elevated p-6 shadow-[var(--shadow)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"
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
