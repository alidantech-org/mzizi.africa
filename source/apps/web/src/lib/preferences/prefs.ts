/**
 * Look preferences in one place: colour mode, palette, contrast, text size, links, motion and spacing.
 * The popover, the preferences page and Reset all use this store, so they always agree. Saved in cookies;
 * the page script in layout.tsx applies the saved values before first paint and the server renders the rest.
 */
import { createContext, useContext, useSyncExternalStore } from "react";
import { FLAG_COLORS } from "#demo/_data/flag-colors";
import {
  COOKIES,
  DEFAULT_A11Y,
  DEFAULT_SIDE,
  DEFAULT_THEME,
  decodeTheme,
  encodeA11y,
  encodeTheme,
  migrateLegacy,
  readCookie,
  writeCookie,
  type A11y,
  type Mode,
  type PrefsInit,
  type Theme,
} from "#/lib/preferences/pref-cookies";
import { setVoice } from "#/lib/accessibility/speech";

export { DEFAULT_A11Y, DEFAULT_THEME };
export type { A11y, Mode, Theme };

/**
 * `theme.palette` is the chosen palette id. "flag" means the reader follows the flag of whichever country they are in.
 * `flagPrimary` is the flag colour picked as the main one for the current country; it is cleared whenever the country
 * changes. `base` is the last ordinary palette, kept for countries without a flag palette.
 * Everything is saved in cookies (see pref-cookies.ts), so the server paints the same look the page script applies.
 */
let theme = DEFAULT_THEME;
let a11y = DEFAULT_A11Y;
let loaded = false;
let primaryCountry: string | null = null; // the country the picked primary colour belongs to
const subs = new Set<() => void>();
const emit = () => subs.forEach((f) => f());
const saveTheme = () => writeCookie(COOKIES.theme, encodeTheme(theme, primaryCountry));

/** What the server read from the cookies. The store starts from it on both sides, so the first paint agrees. */
export const PrefsInitContext = createContext<PrefsInit>({
  theme: DEFAULT_THEME,
  a11y: DEFAULT_A11Y,
  side: DEFAULT_SIDE,
  groups: [],
  place: null,
});
export const usePrefsInit = () => useContext(PrefsInitContext);
/** Called while rendering in the browser, before the first hook reads the store. */
export function seedPrefs(init: PrefsInit) {
  if (loaded || typeof window === "undefined") return;
  theme = init.theme;
  a11y = init.a11y;
  primaryCountry = decodeTheme(readCookie(COOKIES.theme)).primaryCountry;
}

/** True when the reader follows flags and the current country has one. */
export const flagActive = (t: Theme) => t.palette === "flag" && !!FLAG_COLORS[t.country];
/** True when the reader chose their own colour. */
export const customActive = (t: Theme) => t.palette === "custom" && !!t.custom;
/** The primary colour in use: the picked one if it belongs to this flag, otherwise the country's dominant colour. */
export const flagPrimaryOf = (t: Theme) => {
  const f = FLAG_COLORS[t.country];
  return f && t.flagPrimary && f.colors.some((c) => c.hex === t.flagPrimary) ? t.flagPrimary : (f?.dominant ?? "");
};

function applyTheme() {
  const dark = theme.mode === "dark" || (theme.mode === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
  const root = document.documentElement;
  root.dataset.mode = dark ? "dark" : "light";
  root.dataset.palette =
    flagActive(theme) || customActive(theme) ? "flag" : theme.palette === "flag" ? theme.base : theme.palette; // the flag colours themselves come from <FlagPalette />
}
function applyA11y() {
  const h = document.documentElement;
  h.dataset.contrast = a11y.contrast;
  h.style.fontSize = `${a11y.size}%`;
  h.dataset.links = a11y.links ? "underline" : "";
  h.dataset.motion = a11y.motion ? "reduce" : "";
  h.dataset.spacing = a11y.spacing ? "wide" : "";
}

/** Applies the saved values and follows the system colour scheme. Safe to call more than once. */
export function initPrefs(init: PrefsInit) {
  if (loaded || typeof window === "undefined") return;
  seedPrefs(init);
  loaded = true;
  migrateLegacy();
  applyTheme();
  applyA11y();
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => theme.mode === "system" && applyTheme());
  emit();
}

export const subscribePrefs = (f: () => void) => (subs.add(f), () => subs.delete(f));
export const useTheme = () => {
  const init = usePrefsInit();
  return useSyncExternalStore(
    subscribePrefs,
    () => theme,
    () => init.theme,
  );
};
export const useA11y = () => {
  const init = usePrefsInit();
  return useSyncExternalStore(
    subscribePrefs,
    () => a11y,
    () => init.a11y,
  );
};

export function setTheme(patch: Partial<Theme>) {
  theme = { ...theme, ...patch };
  if ("flagPrimary" in patch) primaryCountry = theme.flagPrimary ? theme.country || null : null;
  saveTheme();
  applyTheme();
  emit();
}
/** Tell the store which country the reader is in, so a flag palette can switch on or off. */
export function setCountry(code: string) {
  if (theme.country === code && (!primaryCountry || primaryCountry === code)) return;
  // A picked primary colour belongs to the country it was picked in. Any other country starts at its dominant colour.
  const reset = !!primaryCountry && primaryCountry !== code;
  theme = { ...theme, country: code, flagPrimary: reset ? null : theme.flagPrimary };
  if (reset) {
    primaryCountry = null;
    saveTheme();
  }
  if (loaded) applyTheme();
  emit();
}
export function setA11y(patch: Partial<A11y>) {
  a11y = { ...a11y, ...patch };
  writeCookie(COOKIES.a11y, encodeA11y(a11y));
  applyA11y();
  emit();
}

/** Back to the defaults: colours, contrast, text and display options, and voice. */
export function resetPrefs() {
  setTheme({ ...DEFAULT_THEME, country: theme.country });
  setA11y(DEFAULT_A11Y);
  setVoice({ mode: "off", rate: 1 });
}
