/**
 * Preferences kept in cookies, one cookie per topic, so the server can paint the page the way you left it.
 * Each value is a short positional string with "~" between fields. Values are a few tens of bytes, so general
 * compression would make them longer; the short codes are the compression. Used by the server and the browser.
 */
import type { Place } from "#demo/_lib/navigation/route";

export type Mode = "system" | "light" | "dark";
export type Theme = {
  mode: Mode;
  palette: string;
  base: string;
  flagPrimary: string | null;
  country: string;
  custom: string | null;
};
export type A11y = { contrast: string; size: number; links: boolean; motion: boolean; spacing: boolean };
export type SideMode = "expanded" | "rail" | "hidden";
export type Side = { w: number; mode: SideMode };
export type PrefsInit = { theme: Theme; a11y: A11y; side: Side; groups: string[]; place: Place | null };

export const DEFAULT_THEME: Theme = {
  mode: "system",
  palette: "savanna",
  base: "savanna",
  flagPrimary: null,
  country: "",
  custom: null,
};
export const DEFAULT_A11Y: A11y = { contrast: "standard", size: 100, links: false, motion: false, spacing: false };
export const DEFAULT_SIDE: Side = { w: 264, mode: "expanded" };
export const GROUPS = ["Politics", "Government", "Money", "Data"] as const;

export const COOKIES = {
  theme: "mzizi-demo-theme",
  a11y: "mzizi-demo-a11y",
  side: "mzizi-demo-side",
  groups: "mzizi-demo-groups",
  place: "mzizi-demo-place",
} as const;

const MODES: Record<string, Mode> = { s: "system", l: "light", d: "dark" };
const SIDES: Record<string, SideMode> = { e: "expanded", r: "rail", h: "hidden" };
const letter = <T extends string>(map: Record<string, T>, v: T) =>
  Object.keys(map).find((k) => map[k] === v) ?? Object.keys(map)[0];

/** `d~flag~savanna~ke:bb0000~1f6b52` = mode, palette, base palette, picked flag colour with its country, and the reader's own colour. */
export const encodeTheme = (t: Theme, primaryCountry: string | null) =>
  [
    letter(MODES, t.mode),
    t.palette,
    t.base,
    t.flagPrimary && primaryCountry ? `${primaryCountry}:${t.flagPrimary.slice(1)}` : "",
    t.custom ? t.custom.slice(1) : "",
  ].join("~");
export function decodeTheme(raw?: string): { theme: Theme; primaryCountry: string | null } {
  const [m, p, b, f, u] = (raw ?? "").split("~");
  const [pc, hex] = (f ?? "").split(":");
  return {
    theme: {
      ...DEFAULT_THEME,
      mode: MODES[m] ?? "system",
      palette: p || "savanna",
      base: b || "savanna",
      flagPrimary: pc && /^[0-9a-f]{6}$/i.test(hex ?? "") ? `#${hex}` : null,
      custom: /^[0-9a-f]{6}$/i.test(u ?? "") ? `#${u}` : null,
    },
    primaryCountry: pc && hex ? pc : null,
  };
}

/** `yellow~110~lm` = contrast, text size percent, and one letter per switched-on option (l links, m motion, s spacing). */
export const encodeA11y = (a: A11y) =>
  [a.contrast, a.size, (a.links ? "l" : "") + (a.motion ? "m" : "") + (a.spacing ? "s" : "")].join("~");
export function decodeA11y(raw?: string): A11y {
  const [c, s, f = ""] = (raw ?? "").split("~");
  const size = Number(s);
  return {
    contrast: c || "standard",
    size: size >= 80 && size <= 200 ? size : 100,
    links: f.includes("l"),
    motion: f.includes("m"),
    spacing: f.includes("s"),
  };
}

/** `e~264` = sidebar mode letter and width. */
export const encodeSide = (s: Side) => `${letter(SIDES, s.mode)}~${Math.round(s.w)}`;
export function decodeSide(raw?: string): Side {
  const [m, w] = (raw ?? "").split("~");
  const n = Number(w);
  return { mode: SIDES[m] ?? "expanded", w: n >= 200 && n <= 380 ? n : 264 };
}

/** Collapsed sidebar groups as the digits of their positions: "02" = Politics and Money are closed. */
export const encodeGroups = (closed: string[]) =>
  closed
    .map((g) => GROUPS.indexOf(g as (typeof GROUPS)[number]))
    .filter((i) => i >= 0)
    .sort()
    .join("");
export const decodeGroups = (raw?: string): string[] => [...(raw ?? "")].map((d) => GROUPS[Number(d)]).filter(Boolean);

/** `ke~nairobi~westlands` = country then the trail. */
export const encodePlace = (p: Place) => [p.country, ...p.trail].join("~");
export function decodePlace(raw?: string): Place | null {
  const s = (raw ?? "").split("~").filter((x) => /^[a-z0-9-]+$/.test(x));
  return s.length ? { country: s[0], trail: s.slice(1) } : null;
}

/** Browser only: read and write one cookie. Kept for a year, sent with every page request. */
export const readCookie = (name: string) => {
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : undefined;
};
export const writeCookie = (name: string, value: string) => {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/demo; max-age=31536000; samesite=lax`;
};

/** One-time: copy values an earlier version kept in localStorage into cookies, so nobody loses their settings. */
export function migrateLegacy() {
  try {
    const ls = (k: string) => localStorage.getItem(k);
    if (readCookie(COOKIES.theme) === undefined && (ls("mzizi-demo-mode") || ls("mzizi-demo-palette"))) {
      const [pc] = (ls("mzizi-demo-flag-primary") ?? "").split("|");
      const t = decodeTheme(
        `${ls("mzizi-demo-mode") === "dark" ? "d" : ls("mzizi-demo-mode") === "light" ? "l" : "s"}~${ls("mzizi-demo-palette") ?? "savanna"}~${ls("mzizi-demo-palette-base") ?? "savanna"}~${pc ? `${pc}:${(ls("mzizi-demo-flag-primary") ?? "").split("|")[1]?.slice(1) ?? ""}` : ""}`,
      );
      writeCookie(COOKIES.theme, encodeTheme(t.theme, t.primaryCountry));
    }
    if (readCookie(COOKIES.a11y) === undefined && ls("mzizi-demo-a11y"))
      writeCookie(COOKIES.a11y, encodeA11y({ ...DEFAULT_A11Y, ...JSON.parse(ls("mzizi-demo-a11y")!) }));
    if (readCookie(COOKIES.side) === undefined && ls("mzizi-demo-side"))
      writeCookie(COOKIES.side, encodeSide({ ...DEFAULT_SIDE, ...JSON.parse(ls("mzizi-demo-side")!) }));
    if (readCookie(COOKIES.groups) === undefined && ls("mzizi-demo-groups"))
      writeCookie(COOKIES.groups, encodeGroups(JSON.parse(ls("mzizi-demo-groups")!)));
    if (readCookie(COOKIES.place) === undefined && ls("mzizi-demo-place"))
      writeCookie(COOKIES.place, encodePlace(JSON.parse(ls("mzizi-demo-place")!) as Place));
  } catch {}
}
