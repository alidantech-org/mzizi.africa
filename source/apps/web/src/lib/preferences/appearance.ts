"use client";
/**
 * Appearance preferences beyond colour: how compact the layout is, corner radius, border visibility, card style and the
 * map's colour grading, outline weight, height and labels. Each choice is one short code in the `mzizi-app-look` cookie
 * and one data attribute on <html>; real.css turns the attribute into the look. The page script in layout.tsx sets the
 * attributes before first paint, so nothing flashes.
 */
import { useSyncExternalStore } from "react";
import { COOKIES, readCookie, writeCookie } from "#/lib/preferences/pref-cookies";

/** Every choice, in cookie order. The first value of each is the default. */
export const LOOK_OPTIONS = {
  density: ["normal", "compact", "roomy"],
  radius: ["soft", "sharp", "round", "pill"],
  border: ["normal", "none", "faint", "strong"],
  card: ["outline", "flat", "raised", "tinted"],
  grade: ["palette", "cool", "green", "violet", "mono", "heat", "viridis"],
  mstroke: ["normal", "thin", "thick"],
  mheight: ["normal", "short", "tall"],
  mlabels: ["hover", "off"],
} as const;
export type LookKey = keyof typeof LOOK_OPTIONS;
export type Look = { [K in LookKey]: (typeof LOOK_OPTIONS)[K][number] };
export const LOOK_KEYS = Object.keys(LOOK_OPTIONS) as LookKey[];
export const DEFAULT_LOOK = Object.fromEntries(LOOK_KEYS.map((k) => [k, LOOK_OPTIONS[k][0]])) as Look;

let look: Look = DEFAULT_LOOK;
let loaded = false;
const subs = new Set<() => void>();

const decode = (raw: string | undefined): Look => {
  const parts = (raw ?? "").split("~");
  const out = { ...DEFAULT_LOOK } as Record<LookKey, string>;
  LOOK_KEYS.forEach((k, i) => {
    const v = parts[i];
    if (v && (LOOK_OPTIONS[k] as readonly string[]).includes(v)) out[k] = v;
  });
  return out as Look;
};
const apply = () => LOOK_KEYS.forEach((k) => (document.documentElement.dataset[k] = look[k]));

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  look = decode(readCookie(COOKIES.look));
}
const subscribe = (fn: () => void) => (load(), subs.add(fn), () => subs.delete(fn));
const snapshot = () => (load(), look);

export const useLook = () => useSyncExternalStore(subscribe, snapshot, () => DEFAULT_LOOK);

export function setLook<K extends LookKey>(key: K, value: Look[K]) {
  load();
  look = { ...look, [key]: value };
  writeCookie(COOKIES.look, LOOK_KEYS.map((k) => look[k]).join("~"));
  apply();
  subs.forEach((f) => f());
}

export function resetLook() {
  look = DEFAULT_LOOK;
  writeCookie(COOKIES.look, "");
  apply();
  subs.forEach((f) => f());
}
