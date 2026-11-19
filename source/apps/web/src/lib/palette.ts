/**
 * Server-rendered ECharts SVG cannot read CSS variables directly, so charts are written with
 * sentinel colours and each is swapped for a `var(--token)` after rendering. One source of truth:
 * the same tokens drive the page, the charts, the map and the graph.
 */
export const tokens = {
  ink: ["#010101", "var(--ink)"],
  muted: ["#020202", "var(--muted)"],
  line: ["#030303", "var(--line)"],
  surface: ["#040404", "var(--surface)"],
  c1: ["#050505", "var(--c1)"],
  c2: ["#060606", "var(--c2)"],
  c3: ["#070707", "var(--c3)"],
  c4: ["#080808", "var(--c4)"],
  c5: ["#090909", "var(--c5)"],
} as const;

export const palette = {
  ink: tokens.ink[0],
  muted: tokens.muted[0],
  line: tokens.line[0],
  surface: tokens.surface[0],
  series: [tokens.c1[0], tokens.c2[0], tokens.c3[0], tokens.c4[0], tokens.c5[0]],
} as const;

/** Replace every sentinel colour in rendered SVG with its CSS variable. */
export function themed(svg: string): string {
  return Object.values(tokens).reduce((out, [sentinel, css]) => out.replaceAll(new RegExp(sentinel, "gi"), css), svg);
}

/** Read the live token values in the browser (used by the WebGL graph). */
export function readTokens(): Record<"ink" | "muted" | "line" | "surface" | "c1" | "c2" | "c3" | "c4" | "c5", string> {
  const css = getComputedStyle(document.documentElement);
  const get = (name: string) => css.getPropertyValue(`--${name}`).trim();
  return { ink: get("ink"), muted: get("muted"), line: get("line"), surface: get("surface"), c1: get("c1"), c2: get("c2"), c3: get("c3"), c4: get("c4"), c5: get("c5") };
}
