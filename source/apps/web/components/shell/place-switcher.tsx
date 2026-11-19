"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { findPlaces, type PlaceChoice } from "#/app/actions.ts";
import { useLanguage } from "#/lib/site/i18n.tsx";

/** The sections that exist under a place, so switching place keeps the section the visitor is in. */
const SCOPED = ["places", "leaders", "elections", "finance", "data/statistics", "data/compare", "infrastructure", "calendar"];

/** Finds a place by name and opens it, keeping the current section when that section exists under a place. */
export function PlaceSwitcher({ currentPath }: { currentPath: string | null }) {
  const { tr, language } = useLanguage();
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [choices, setChoices] = useState<PlaceChoice[]>([]);
  const [pending, start] = useTransition();
  const rest = currentPath && pathname.startsWith(`/${currentPath}/`) ? pathname.slice(currentPath.length + 2) : pathname.slice(1);
  const section = SCOPED.find((word) => rest === word);
  useEffect(() => {
    if (query.trim().length < 2) {
      setChoices([]);
      return;
    }
    const timer = setTimeout(() => start(async () => setChoices(await findPlaces(query, language))), 220);
    return () => clearTimeout(timer);
  }, [query, language]);
  return (
    <div className="relative">
      <label className="sr-only" htmlFor="place-switch">{tr("Change place")}</label>
      <input
        id="place-switch"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={currentPath ? tr("Change place") : tr("Choose your place")}
        autoComplete="off"
        className="w-full rounded-lg border border-[var(--border-default)] bg-surface-sunken px-3 py-2 text-sm outline-none placeholder:text-content-muted focus:border-[var(--clay)] focus:ring-2 focus:ring-[var(--clay)]/30"
      />
      {query.trim().length >= 2 ? (
        <ul className="glass-strong absolute inset-x-0 top-full z-50 mt-1 max-h-72 overflow-auto rounded-xl p-1 text-sm" role="listbox">
          {choices.map((choice) => (
            <li key={choice.path}>
              <Link
                href={`/${choice.path}${section ? `/${section}` : ""}`}
                onClick={() => setQuery("")}
                className="flex items-center justify-between gap-2 rounded-lg px-3 py-2 hover:bg-surface-sunken"
              >
                <span className="truncate font-semibold">{choice.name}</span>
                <span className="chip shrink-0">{choice.kind}</span>
              </Link>
            </li>
          ))}
          {choices.length === 0 ? <li className="px-3 py-2 text-content-muted">{pending ? tr("Searching…") : tr("No place by that name")}</li> : null}
        </ul>
      ) : null}
    </div>
  );
}
