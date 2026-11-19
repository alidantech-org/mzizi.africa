"use client";

/** Small shared building blocks: breadcrumbs with hints, section headings, stat tiles, tabs and the "what is missing" notice. */
import { Hint } from "#/components/site/ui/hint.tsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { useLanguage } from "#/lib/site/i18n.tsx";
import { placeAt } from "#/lib/site/links.ts";
import type { Crumb } from "#/lib/site/insights.ts";

export interface TrailItem {
  readonly label: string;
  readonly href?: string;
  /** A short sentence that says what this level is (shown as a tooltip and read by screen readers). */
  readonly hint?: string;
}

/** Where you are, with a hint for each level. The last item is the current page and is not a link. */
/** The app bar carries the breadcrumbs now; pages that still declare a trail render nothing for it. */
export function Breadcrumbs({ items }: { items: readonly TrailItem[] }) {
  const { tr } = useLanguage();
  if (items.length >= 0) return null;
  return (
    <nav aria-label="Breadcrumb" className="crumbs mb-5 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-content-muted">
      {items.map((item, index) => {
        const last = index === items.length - 1;
        return (
          <span key={`${item.label}-${index}`} className="flex items-center gap-1.5">
            {index > 0 ? <span aria-hidden className="opacity-50">›</span> : null}
            {item.href && !last ? (
              <Link href={item.href} title={item.hint ? tr(item.hint) : undefined} className="rounded-md px-1.5 py-0.5 hover:bg-surface-sunken hover:text-content-primary">
                {tr(item.label)}
              </Link>
            ) : (
              <span aria-current={last ? "page" : undefined} title={item.hint ? tr(item.hint) : undefined} className={last ? "px-1.5 font-semibold text-content-primary" : "px-1.5"}>
                {tr(item.label)}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}

const KIND_HINT: Record<string, string> = {
  country: "The whole country.",
  county: "One of the 47 counties, each run by an elected governor.",
  constituency: "An electoral area that elects one Member of Parliament.",
  ward: "The smallest electoral area; it elects a Member of the County Assembly.",
  town: "A built-up settlement inside a ward.",
  city: "A large built-up settlement.",
  village: "A small community or neighbourhood inside a town or ward.",
};

/** Breadcrumbs for a chain of units, widest first; the place itself ends the trail unless `after` adds more. */
/** `section.suffix` is the section's address under a place (`data/statistics`); it is the same section at country level without the place. */
export function PlaceTrail({ chain, section, after }: { chain: readonly Crumb[]; section: { label: string; suffix: string }; after?: readonly TrailItem[] }) {
  const items: TrailItem[] = [
    { label: "Home", href: "/", hint: "Start page" },
    { label: section.label, href: placeAt(null, section.suffix) },
    ...chain.map((unit, index): TrailItem => ({
      label: unit.name,
      href: index === chain.length - 1 && !after ? undefined : placeAt(unit.path, section.suffix),
      hint: `${unit.kindLabel}. ${KIND_HINT[unit.kindCode.replace(/^.*\./, "")] ?? ""}`.trim(),
    })),
    ...(after ?? []),
  ];
  return <Breadcrumbs items={items} />;
}

export function Section({ title, kicker, action, children, id }: { title: string; kicker?: string; action?: ReactNode; children: ReactNode; id?: string }) {
  const { tr } = useLanguage();
  return (
    <section id={id} className="mt-12 scroll-mt-24">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          {kicker ? <p className="kicker">{tr(kicker)}</p> : null}
          <h2 className="font-display text-2xl sm:text-3xl">{tr(title)}</h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

/** Plain-words meanings for terms that appear as statistic labels. The first entry whose word occurs in the label is shown. */
const GLOSSARY: readonly (readonly [RegExp, string])[] = [
  [/per km²|density/i, "How many people live in each square kilometre. Higher means more crowded."],
  [/registered voters|voters/i, "People who signed up on the IEBC register and can vote."],
  [/turnout/i, "Of everyone registered, the share who actually voted."],
  [/open tenders/i, "Government buying notices still accepting bids from suppliers."],
  [/tender/i, "A public notice asking suppliers to bid to build or supply something for government."],
  [/per 100,000/i, "A fair way to compare places of different sizes: the count for every 100,000 residents."],
  [/ngcdf|development fund/i, "The National Government Constituency Development Fund: money each constituency gets for local projects."],
  [/completion/i, "Of the projects on record, the share that are finished."],
  [/rank/i, "Position among similar places. #1 is the highest."],
  [/population|people/i, "Counted by the national census, or estimated between censuses."],
  [/area/i, "Land and inland water within the boundary, in square kilometres."],
  [/division|vote/i, "A recorded vote in the house: yes, no, abstain or absent."],
];

export function Stat({ label, value, hint, tone }: { label: string; value: ReactNode; hint?: ReactNode; tone?: "good" | "bad" | "plain" }) {
  const { tr } = useLanguage();
  const meaning = GLOSSARY.find(([re]) => re.test(label))?.[1];
  return (
    <div className="glass card card-lift">
      <p className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-content-muted">
        {tr(label)}
        {meaning ? <Hint label={tr("What does this mean?")}>{tr(meaning)}</Hint> : null}
      </p>
      <p className={`num mt-1 font-display text-3xl ${tone === "good" ? "text-raffia" : tone === "bad" ? "text-danger" : ""}`}>{value}</p>
      {hint ? <p className="mt-1 text-xs text-content-muted">{typeof hint === "string" ? tr(hint) : hint}</p> : null}
    </div>
  );
}

/** Links that act as tabs for one place: the address decides which is active. */
export function PlaceTabs({ path }: { path?: string | null }) {
  const here = usePathname();
  const tabs = [
    { href: placeAt(path, ""), label: "Overview", suffix: "" },
    { href: placeAt(path, "data/statistics"), label: "Statistics", suffix: "/data/statistics" },
    { href: placeAt(path, "elections"), label: "Elections", suffix: "/elections" },
    { href: placeAt(path, "finance"), label: "Money & projects", suffix: "/finance" },
    { href: placeAt(path, "places"), label: "Places inside", suffix: "/places" },
    { href: "/data/compare", label: "Compare", suffix: "/data/compare" },
  ];
  const active = (suffix: string): boolean => (suffix === "" ? here === placeAt(path, "") : here.endsWith(suffix));
  return (
    <div role="tablist" aria-label="About this place" className="glass mb-6 flex gap-1 overflow-x-auto rounded-full p-1">
      {tabs.map((tab) => (
        <Link key={tab.label} role="tab" href={tab.href} className="tab" data-active={active(tab.suffix)} aria-selected={active(tab.suffix)}>
          {tab.label}
        </Link>
      ))}
    </div>
  );
}

const SUBJECT = "Mzizi data request";

/** What is missing, said plainly, with two ways forward: ask for the data, or look at the official source yourself. */
export function Gaps({ items, topic }: { items: readonly string[]; topic?: string }) {
  if (items.length === 0) return null;
  const ask = `mailto:data@mzizi.africa?subject=${encodeURIComponent(`${SUBJECT}: ${topic ?? "missing data"}`)}&body=${encodeURIComponent(items.join("\n"))}`;
  return (
    <aside role="note" className="glass card mt-8 border-l-4" style={{ borderLeftColor: "var(--calabash)" }}>
      <p className="kicker" style={{ color: "var(--calabash)" }}>Not available yet</p>
      <ul className="mt-2 space-y-1 text-sm">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <div className="mt-3 flex flex-wrap gap-2">
        <a className="btn btn-primary" href={ask}>Ask for this data</a>
        <Link className="btn btn-ghost" href="/data/sources">Check the official sources yourself</Link>
      </div>
    </aside>
  );
}

export function Loading({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-3" aria-busy="true">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="skeleton h-16 rounded-2xl" />
      ))}
    </div>
  );
}

export function ErrorBox({ message }: { message: string }) {
  return (
    <div role="alert" className="glass card border-l-4" style={{ borderLeftColor: "var(--danger)" }}>
      <p className="font-semibold text-danger">Something went wrong</p>
      <p className="mt-1 text-sm text-content-muted">{message}</p>
    </div>
  );
}

export function PageFrame({ children, wide }: { children: ReactNode; wide?: boolean }) {
  return <div className={`mx-auto px-5 pb-10 pt-6 ${wide ? "max-w-7xl" : "max-w-6xl"}`}>{children}</div>;
}

export function Pill({ children, tone = "plain" }: { children: ReactNode; tone?: "plain" | "good" | "warn" | "bad" | "info" }) {
  const color = { plain: "var(--content-muted)", good: "var(--raffia)", warn: "var(--calabash)", bad: "var(--danger)", info: "var(--indigo)" }[tone];
  return (
    <span className="chip" style={{ color, borderColor: `color-mix(in oklch, ${color} 40%, transparent)` }}>
      {children}
    </span>
  );
}
