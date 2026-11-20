/** Flag colours measured from each country's registered flag file and delivered by the backend. Nothing is written here by hand. */
import { chromaticColors } from "#/lib/charts/flag-palette";

export type FlagColor = { hex: string; label: string; share: number };
export type FlagDef = { dominant: string; colors: FlagColor[] };
export type FlagCountry = { code: string; flagColors: FlagColor[] };

const registry: Record<string, FlagDef> = {};

/** Filled while rendering, on the server and in the browser, from the same catalogue, so the first paint agrees. */
export function registerFlags(countries: readonly FlagCountry[]) {
  for (const c of countries) {
    if (!c.flagColors.length) {
      delete registry[c.code];
      continue;
    }
    const colors = [...c.flagColors].sort((a, b) => b.share - a.share);
    const strong = chromaticColors(colors.map((x) => x.hex));
    registry[c.code] = { colors, dominant: strong[0] ?? colors[0].hex };
  }
}

export const flagOf = (country: string): FlagDef | undefined => registry[country];
