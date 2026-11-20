/** Saved places with labels, kept in this browser. The home place and language are also written to cookies so the server can personalise. */
import { pathOf } from "#/lib/navigation/route";
import type { Place } from "#/lib/navigation/route";

export type Saved = { path: string; label: string };
const KEY = "mzizi-app-saved";

export function readSaved(): Saved[] {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? "[]") as (string | Saved)[];
    return raw.map((x) => (typeof x === "string" ? { path: x, label: "" } : x));
  } catch {
    return [];
  }
}
export function writeSaved(list: Saved[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {}
}

const cookie = (name: string, value: string) => {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=31536000; samesite=lax`;
};
export const readCookie = (name: string) => {
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : null;
};

export const homePath = pathOf;
export function readHome(): Place | null {
  try {
    const c = readCookie("mzizi-app-home");
    return c ? (JSON.parse(c) as Place) : null;
  } catch {
    return null;
  }
}
export function writeHome(p: Place) {
  cookie("mzizi-app-home", JSON.stringify(p));
  const list = readSaved().filter((s) => s.label !== "Home");
  writeSaved([{ path: homePath(p), label: "Home" }, ...list.filter((s) => s.path !== homePath(p))]);
}
export const writeLang = (l: string) => cookie("mzizi-app-lang", l);
export const readLang = () => readCookie("mzizi-app-lang") ?? "en";

/** How often each subject is opened, so the home page can lead with what you use. Stays on this device. */
export function countView(view: string) {
  try {
    const c = JSON.parse(localStorage.getItem("mzizi-app-views") ?? "{}") as Record<string, number>;
    c[view] = (c[view] ?? 0) + 1;
    localStorage.setItem("mzizi-app-views", JSON.stringify(c));
  } catch {}
}
export function topViews(n: number): string[] {
  try {
    return Object.entries(JSON.parse(localStorage.getItem("mzizi-app-views") ?? "{}") as Record<string, number>)
      .sort((a, b) => b[1] - a[1])
      .slice(0, n)
      .map(([k]) => k);
  } catch {
    return [];
  }
}

/** The count badge on the saved-places icon can be hidden. Kept in localStorage and in a cookie, so it survives either being cleared. */
export const readHideCount = () => {
  try {
    if (localStorage.getItem("mzizi-app-hide-count") === "1") return true;
  } catch {}
  return readCookie("mzizi-app-hide-count") === "1";
};
export function writeHideCount(hide: boolean) {
  try {
    localStorage.setItem("mzizi-app-hide-count", hide ? "1" : "0");
  } catch {}
  document.cookie = `mzizi-app-hide-count=${hide ? 1 : 0}; path=/; max-age=31536000; samesite=lax`;
  dispatchEvent(new Event("mzizi-app:count"));
}
