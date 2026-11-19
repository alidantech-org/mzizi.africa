"use client";

/** Place search is a GET navigation. Results are read and rendered by the server. */
import { useSearchParams } from "next/navigation";
import { useLanguage } from "#/lib/site/i18n.tsx";

export function PlaceSwitcher({ currentPath }: { currentPath: string | null }) {
  const { tr } = useLanguage();
  const query = useSearchParams();
  return <form action={`/${currentPath ?? ""}`} className="space-y-2">
    <input type="hidden" name="view" value="search" />
    <input type="hidden" name="filters.kind" value="place" />
    {query.get("lang") ? <input type="hidden" name="lang" value={query.get("lang")!} /> : null}
    <label className="block text-xs font-semibold" htmlFor="place-search">{tr("Find another place")}</label>
    <input id="place-search" name="filters.q" required minLength={2} className="input w-full" placeholder={tr("Search by name")} />
    <button className="btn btn-primary w-full" type="submit">{tr("Find place")}</button>
  </form>;
}
