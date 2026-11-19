"use client";
/** Writes the flag palette as CSS, so the server sends it with the page and nothing repaints on load. */
import { FLAG_COLORS } from "#/data/flag-colors";
import { flagCss } from "#/lib/flag-palette";
import { customActive, flagActive, flagPrimaryOf, useTheme } from "#/lib/prefs";
import { useCtx } from "#/lib/use-ctx";

export function FlagPalette() {
  const theme = useTheme();
  const { country, explorer } = useCtx();
  const t = { ...theme, country: explorer ? country : theme.country }; // outside the explorer the theme keeps the last country
  if (customActive(t)) return <style id="mzizi-flag-palette" dangerouslySetInnerHTML={{ __html: flagCss([t.custom!], t.custom!) }} />;
  if (!flagActive(t)) return null;
  return <style id="mzizi-flag-palette" dangerouslySetInnerHTML={{ __html: flagCss(FLAG_COLORS[t.country].colors.map((c) => c.hex), flagPrimaryOf(t)) }} />;
}
