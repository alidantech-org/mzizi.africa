/** Number formatting shared by pages. */
export const compact = (n: number) => new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(n);
export const int = (n: number) => new Intl.NumberFormat("en").format(Math.round(n));
export const pct = (n: number) => `${Math.round(n)}%`;
