/** Shared ECharts presets. Colours are theme sentinels (see palette.ts). */
import { palette } from "./palette";

export const axis = { axisLine: { lineStyle: { color: palette.line } }, axisTick: { show: false }, axisLabel: { color: palette.muted } };
export const gridLine = { lineStyle: { color: palette.line, type: "dashed" as const } };
export const valueAxis = { type: "value" as const, splitLine: gridLine, axisLabel: { color: palette.muted } };
export const grid = { left: 44, right: 16, top: 28, bottom: 28 };
export const legend = { top: 0, right: 0, icon: "circle", itemWidth: 9, textStyle: { color: palette.muted } };
export { palette };
