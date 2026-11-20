/** Small statistics helpers for the demo charts. */
export const sorted = (xs: number[]) => [...xs].sort((a, b) => a - b);
export const quantile = (xs: number[], q: number) => {
  const s = sorted(xs);
  const pos = (s.length - 1) * q;
  const lo = Math.floor(pos);
  return s[lo] + (s[Math.min(lo + 1, s.length - 1)] - s[lo]) * (pos - lo);
};
export const median = (xs: number[]) => quantile(xs, 0.5);

/** Box plot row: [min, q1, median, q3, max] using 1.5 IQR whiskers; outliers returned separately. */
export function box(xs: number[]) {
  const q1 = quantile(xs, 0.25),
    q3 = quantile(xs, 0.75),
    iqr = q3 - q1;
  const inside = xs.filter((x) => x >= q1 - 1.5 * iqr && x <= q3 + 1.5 * iqr);
  return { row: [Math.min(...inside), q1, median(xs), q3, Math.max(...inside)], outliers: xs.filter((x) => !inside.includes(x)) };
}

export function regression(points: [number, number][]) {
  const n = points.length;
  const sx = points.reduce((a, p) => a + p[0], 0),
    sy = points.reduce((a, p) => a + p[1], 0);
  const sxy = points.reduce((a, p) => a + p[0] * p[1], 0),
    sxx = points.reduce((a, p) => a + p[0] * p[0], 0);
  const slope = (n * sxy - sx * sy) / (n * sxx - sx * sx);
  return { slope, intercept: (sy - slope * sx) / n };
}
