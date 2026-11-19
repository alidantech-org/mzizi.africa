/** Interpolates the theme's data ramp (OKLCH custom properties) in JavaScript, for map fills that cannot use CSS functions. */
type Oklch = readonly [number, number, number];
const FALLBACK: Record<string, Oklch> = { "--ramp-low": [0.94, 0.04, 90], "--ramp-mid": [0.72, 0.14, 60], "--ramp-high": [0.45, 0.16, 30] };

function read(name: string): Oklch {
  if (typeof window === "undefined") return FALLBACK[name]!;
  const text = getComputedStyle(document.documentElement).getPropertyValue(name);
  const m = /oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)/.exec(text);
  return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : FALLBACK[name]!;
}

export function rampFill(fraction: number): string {
  const t = Math.min(1, Math.max(0, Number.isFinite(fraction) ? fraction : 0));
  const [a, b, c] = [read("--ramp-low"), read("--ramp-mid"), read("--ramp-high")];
  const [from, to, u] = t < 0.5 ? [a, b, t * 2] : [b, c, (t - 0.5) * 2];
  const mix = (i: number) => from[i]! + (to[i]! - from[i]!) * u;
  return `oklch(${mix(0).toFixed(3)} ${mix(1).toFixed(3)} ${mix(2).toFixed(1)})`;
}

/** A fixed palette for categories (for example the winning party), stable for the same key. */
const CATEGORY = ["oklch(0.585 0.152 41)", "oklch(0.43 0.085 250)", "oklch(0.545 0.095 130)", "oklch(0.735 0.138 76)", "oklch(0.47 0.125 345)", "oklch(0.62 0.105 205)", "oklch(0.5 0.02 55)"];
export function categoryFill(key: string, order: readonly string[]): string {
  const i = order.indexOf(key);
  return CATEGORY[(i < 0 ? order.length : i) % CATEGORY.length]!;
}
