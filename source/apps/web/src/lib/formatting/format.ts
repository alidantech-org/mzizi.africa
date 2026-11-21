/** Number formatting shared by pages. Every function takes the reader's language, so figures are written the way that language writes them. */
export const compact = (n: number, locale = "en") =>
  new Intl.NumberFormat(locale, { notation: "compact", maximumFractionDigits: 1 }).format(n);
export const int = (n: number, locale = "en") => new Intl.NumberFormat(locale).format(Math.round(n));
export const decimal = (n: number, locale = "en", digits = 1) =>
  new Intl.NumberFormat(locale, { maximumFractionDigits: digits }).format(n);
export const pct = (n: number, locale = "en") => new Intl.NumberFormat(locale, { style: "percent", maximumFractionDigits: 0 }).format(n / 100);
/** A change between two periods as a signed percentage, for example +3%. */
export const change = (ratio: number, locale = "en") =>
  new Intl.NumberFormat(locale, { style: "percent", maximumFractionDigits: 1, signDisplay: "exceptZero" }).format(ratio);
