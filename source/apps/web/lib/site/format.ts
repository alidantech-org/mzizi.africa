/** Number and money formatting shared by every screen. Kenya shillings are shown as KSh; large figures are compacted. */
const compact = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });
const whole = new Intl.NumberFormat("en", { maximumFractionDigits: 0 });
const one = new Intl.NumberFormat("en", { maximumFractionDigits: 1 });

export const n = (value: number | null | undefined): string => (value === null || value === undefined ? "—" : whole.format(value));
export const n1 = (value: number | null | undefined): string => (value === null || value === undefined ? "—" : one.format(value));
export const short = (value: number | null | undefined): string => (value === null || value === undefined ? "—" : compact.format(value));
export const ksh = (value: number | null | undefined): string => (value === null || value === undefined ? "—" : `KSh ${compact.format(value)}`);
export const pct = (fraction: number | null | undefined, digits = 1): string =>
  fraction === null || fraction === undefined ? "—" : `${(fraction * 100).toFixed(digits)}%`;
export const date = (iso: string | null | undefined): string =>
  iso ? new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—";
export const year = (iso: string): string => iso.slice(0, 4);
/** `education-infrastructure` as "Education infrastructure". */
export const words = (code: string): string => {
  const text = code.replace(/-/g, " ");
  return text.charAt(0).toUpperCase() + text.slice(1);
};
/** A colour from the theme's data ramp (low to high), as a CSS colour mixing OKLCH tokens. */
export const ramp = (fraction: number): string => {
  const t = Math.min(1, Math.max(0, Number.isFinite(fraction) ? fraction : 0));
  return t < 0.5
    ? `color-mix(in oklch, var(--ramp-mid) ${Math.round(t * 200)}%, var(--ramp-low))`
    : `color-mix(in oklch, var(--ramp-high) ${Math.round((t - 0.5) * 200)}%, var(--ramp-mid))`;
};
