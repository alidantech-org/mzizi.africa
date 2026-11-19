"use client";
/** Current place and view, read from the URL. Outside explorer pages it falls back to the last place visited. */
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { COOKIES, encodePlace, writeCookie } from "./pref-cookies";
import { usePrefsInit } from "./prefs";
import { countView } from "./saved";
import { currentHash, keepScroll } from "./scroll";
import { build, country, DEFAULT_PLACE, parseQuery, toPlace, toView, withParams, type Ctx, type Place, type ViewId } from "./route";


/** The last place comes from the cookie the server read, so the first paint already knows it. `ready` stays for callers that wait on it; it is always true now. */
export function useCtx(): Ctx & { explorer: boolean; ready: boolean } {
  const path = usePathname();
  const sp = useSearchParams();
  const saved = usePrefsInit().place ?? DEFAULT_PLACE;
  const segments = path.split("/").filter(Boolean);
  const explorer = !!segments[0] && !!country(segments[0]);

  useEffect(() => { if (explorer) countView(new URLSearchParams(location.search).get("view") ?? "overview"); }, [explorer, path, sp]);
  useEffect(() => { if (explorer) writeCookie(COOKIES.place, encodePlace({ country: segments[0], trail: segments.slice(1) })); }, [explorer, path]);

  return useMemo(() => {
    const q = parseQuery(Object.fromEntries(sp.entries()));
    const place: Place = explorer ? { country: segments[0], trail: segments.slice(1) } : saved;
    return { ...place, view: explorer ? q.view : "overview", params: explorer ? q.params : {}, lang: q.lang, explorer, ready: true };
  }, [sp, path, saved, explorer]);
}

/** Navigation helpers that follow the transition rules. */
export function useNav() {
  const ctx = useCtx();
  const router = useRouter();
  return {
    ctx,
    viewHref: (v: ViewId) => toView(ctx, v),
    placeHref: (p: Place) => toPlace(ctx, p),
    goPlace: (p: Place) => { keepScroll(); router.push(toPlace(ctx, p) + currentHash(), { scroll: false }); },
    /** Change filters, sorting or a subsection without leaving the place. */
    set: (patch: Record<string, string | null>, replace = true) => { keepScroll(); const url = withParams(ctx, patch) + currentHash(); return replace ? router.replace(url, { scroll: false }) : router.push(url, { scroll: false }); },
    href: (opts?: { view?: ViewId; params?: Record<string, string> }) => build(ctx, opts),
  };
}

export const placeFromHref = (href: string): Place => {
  const [path] = href.split("?");
  const s = path.split("/").filter(Boolean);
  return { country: s[0], trail: s.slice(1) };
};
