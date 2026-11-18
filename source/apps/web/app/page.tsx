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
      <section className="pattern-bg overflow-hidden">
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
      <section className="mx-auto max-w-7xl px-5 py-14">
        <p className="kicker">Explore</p>
        <h2 className="font-display text-3xl sm:text-4xl">Everything about your country, in one place</h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { href: "/browse", icon: "📍", title: t("navPlaces"), body: "Browse counties, constituencies, wards, towns and villages the way the electoral commission lists them." },
            { href: "/statistics", icon: "📊", title: t("navStats"), body: "Population, age, communities, languages, health, schools, water and poverty — mapped and ranked." },
            { href: "/elections", icon: "🗳", title: t("navElections"), body: "Who won, with how many votes, where. Heat maps, turnout and how the voters' register has grown." },
            { href: "/parliament", icon: "🏛", title: t("navParliament"), body: "Bills, budgets and appointments — with the round-table of how every member voted." },
            { href: "/civic", icon: "🏗", title: t("navCivic"), body: "Development fund allocations, what they were spent on, and the schools and roads built." },
            { href: "/leaderboards", icon: "🏆", title: t("navBoards"), body: "Rank places and leaders on spending, delivery, attendance and statistics." },
            { href: "/tenders", icon: "📄", title: t("navTenders"), body: "Open, awarded and completed tenders, with suppliers and what each discloses." },
            { href: "/parties", icon: "🎗", title: t("navParties"), body: "Parties ranked by votes, members, office holders and public funding." },
            { href: routes.sourceBrowse, icon: "📚", title: t("sources"), body: t("sourcesBody") },
          ].map((card, i) => (
            <li key={card.href}>
              <Link href={card.href} style={{ animationDelay: `${i * 60}ms` }} className="glass card card-lift reveal block h-full">
                <span aria-hidden className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-clay/20 to-calabash/25 text-2xl">{card.icon}</span>
                <h3 className="mt-4 font-display text-2xl">{card.title}</h3>
                <p className="mt-1 text-sm text-content-muted">{card.body}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
