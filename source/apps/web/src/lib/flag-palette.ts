/**
 * Builds a full colour palette (light and dark) from a country's flag colours.
 * The chosen primary colour (by default the first strongly coloured flag colour) becomes the accent; the others become the chart series. If the flag has fewer
 * than five colours the rest are hue-shifts of the accent. Lightness is clamped so text and accents stay readable.
 */
type Vars = Record<string, string>;
type HSL = { h: number; s: number; l: number };

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
function toHsl(hex: string): HSL {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => v / 255);
  const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2, d = max - min;
  if (!d) return { h: 0, s: 0, l };
  const s = d / (1 - Math.abs(2 * l - 1));
  const h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return { h: (h * 60 + 360) % 360, s, l };
}
function hsl(h: number, s: number, l: number): string {
  const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = l - c / 2;
  const [r, g, b] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  return "#" + [r, g, b].map((v) => Math.round((v + m) * 255).toString(16).padStart(2, "0")).join("");
}

/** The strongly coloured flag colours: the ones that can be a primary colour. Black and white are neutrals. */
export const chromaticColors = (colors: string[]) => colors.filter((hex) => { const c = toHsl(hex); return c.s > 0.35 && c.l > 0.1 && c.l < 0.9; });

/** `primary` becomes the accent; the other chromatic flag colours become the chart colours. */
export function flagPalette(colors: string[], primary?: string): { light: Vars; dark: Vars } {
  const chroma = chromaticColors(colors);
  const ordered = primary ? [primary, ...chroma.filter((c) => c !== primary)] : chroma; // a colour the reader picked is used even if it is a neutral
  const chromatic = ordered.map(toHsl);
  const accent = chromatic[0] ?? { h: 20, s: 0.7, l: 0.4 };
  const base = [...chromatic];
  for (const shift of [180, 120, 240, 60, 300]) if (base.length < 5) base.push({ ...accent, h: (accent.h + shift) % 360 });
  const series = base.slice(0, 5);
  const { h } = accent;
  const sat = clamp(accent.s, 0.4, 0.85);

  const build = (dark: boolean): Vars => {
    const c = (x: HSL) => hsl(x.h, dark ? clamp(x.s, 0.4, 0.62) : clamp(x.s, 0.45, 0.8), dark ? clamp(x.l, 0.58, 0.68) : clamp(x.l, 0.27, 0.42));
    const vars: Vars = dark
      ? { paper: hsl(h, 0.25, 0.07), surface: hsl(h, 0.22, 0.1), ink: hsl(h, 0.2, 0.93), muted: hsl(h, 0.1, 0.66), line: hsl(h, 0.2, 0.2), accent: c(accent), "accent-soft": hsl(h, 0.4, 0.17) }
      : { paper: hsl(h, 0.3, 0.95), surface: hsl(h, 0.3, 0.985), ink: hsl(h, 0.25, 0.1), muted: hsl(h, 0.12, 0.38), line: hsl(h, 0.2, 0.86), accent: c(accent), "accent-soft": hsl(h, 0.5, 0.9) };
    series.forEach((x, i) => (vars[`c${i + 1}`] = c(x)));
    const ramp = dark ? [0.13, 0.25, 0.38, 0.52, 0.68] : [0.9, 0.72, 0.56, 0.4, 0.24];
    ramp.forEach((l, i) => (vars[`scale-${i}`] = hsl(h, sat * (dark ? 0.85 : 0.9), l)));
    return vars;
  };
  return { light: build(false), dark: build(true) };
}

const block = (selector: string, scheme: string, vars: Vars) => `${selector}{color-scheme:${scheme};${Object.entries(vars).map(([k, v]) => `--${k}:${v}`).join(";")}}`;

/** CSS for `:root[data-palette="flag"]`, light and dark. */
export function flagCss(colors: string[], primary?: string): string {
  const { light, dark } = flagPalette(colors, primary);
  return block(':root[data-palette="flag"]', "light", light) + block(':root[data-palette="flag"][data-mode="dark"]', "dark", dark);
}
