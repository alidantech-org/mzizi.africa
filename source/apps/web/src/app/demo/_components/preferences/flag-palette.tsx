"use client";
/** Writes the flag palette as CSS, so the server sends it with the page and nothing repaints on load. */
import { FLAG_COLORS } from "#demo/_data/flag-colors";
import { flagCss } from "#demo/_lib/charts/flag-palette";
import { customActive, flagActive, flagPrimaryOf, useTheme } from "#demo/_lib/preferences/prefs";
import { useCtx } from "#demo/_lib/navigation/use-ctx";

export function FlagPalette() {
  const theme = useTheme();
  const { country, explorer } = useCtx();
  const t = { ...theme, country: explorer ? country : theme.country }; // outside the explorer the theme keeps the last country
  if (customActive(t))
    return <style id="mzizi-demo-flag-palette" dangerouslySetInnerHTML={{ __html: flagCss([t.custom!], t.custom!) }} />;
  if (!flagActive(t)) return null;
  return (
    <style
      id="mzizi-demo-flag-palette"
      dangerouslySetInnerHTML={{
        __html: flagCss(
          FLAG_COLORS[t.country].colors.map((c) => c.hex),
          flagPrimaryOf(t),
        ),
      }}
    />
  );
}
