"use client";
/**
 * Saved places, the home place and the count badge, all in cookies so the server renders them with the page.
 * The browser keeps one small store over the saved cookie: every component that shows saved places reads it
 * and re-renders when it changes (on this page, or in another tab).
 */
import { useSyncExternalStore } from "react";
import { COOKIES, MAX_SAVED, decodePlace, decodeSaved, encodePlace, encodeSaved, readCookie, writeCookie, type Saved } from "#/lib/preferences/pref-cookies";
import { usePrefsInit } from "#/lib/preferences/prefs";
import { pathOf } from "#/lib/navigation/route";
import type { Place } from "#/lib/navigation/route";

export type { Saved };
export const homePath = pathOf;

/* ---- saved places ---- */
const subs = new Set<() => void>();
let raw: string | undefined;
let cache: Saved[] = [];
function snapshot(): Saved[] {
  const now = readCookie(COOKIES.saved) ?? "";
  if (now !== raw) {
    raw = now;
    cache = decodeSaved(now);
  }
  return cache;
}
const emit = () => subs.forEach((f) => f());
const subscribe = (f: () => void) => {
  subs.add(f);
  addEventListener("focus", f); // another tab may have changed it
  return () => {
    subs.delete(f);
    removeEventListener("focus", f);
  };
};

/** Saved places: the server's copy while rendering and hydrating, the cookie afterwards. */
export function useSaved(): Saved[] {
  const init = usePrefsInit();
  return useSyncExternalStore(subscribe, snapshot, () => init.saved);
}
export const readSaved = (): Saved[] => snapshot();
export function writeSaved(list: Saved[]) {
  writeCookie(COOKIES.saved, encodeSaved(list.slice(0, MAX_SAVED)));
  emit();
}
export const addSaved = (path: string, label = "") =>
  writeSaved([...snapshot().filter((s) => s.path !== path), { path, label }]);
export const removeSaved = (path: string) => writeSaved(snapshot().filter((s) => s.path !== path));
export const labelSaved = (path: string, label: string) =>
  writeSaved(snapshot().map((s) => (s.path === path ? { ...s, label } : s)));

/* ---- home place ---- */
/** The home place is stored like the last place: country then trail. An older JSON value is still understood. */
export function readHome(): Place | null {
  const value = readCookie(COOKIES.home);
  if (!value) return null;
  if (value.startsWith("{")) {
    try {
      return JSON.parse(value) as Place;
    } catch {
      return null;
    }
  }
  return decodePlace(value);
}
/** Choosing a home place also saves it, labelled Home, at the top of the saved places. */
export function writeHome(p: Place) {
  writeCookie(COOKIES.home, encodePlace(p));
  const path = homePath(p);
  writeSaved([{ path, label: "Home" }, ...snapshot().filter((s) => s.label !== "Home" && s.path !== path)]);
}

/* ---- language, views, count badge ---- */
export const writeLang = (l: string) => writeCookie(COOKIES.lang, l);

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

const hideSubs = new Set<() => void>();
export function useHideCount(): boolean {
  const init = usePrefsInit();
  return useSyncExternalStore(
    (f) => (hideSubs.add(f), () => void hideSubs.delete(f)),
    () => readCookie(COOKIES.hideCount) === "1",
    () => init.hideCount,
  );
}
export function writeHideCount(hide: boolean) {
  writeCookie(COOKIES.hideCount, hide ? "1" : "0");
  hideSubs.forEach((f) => f());
}
