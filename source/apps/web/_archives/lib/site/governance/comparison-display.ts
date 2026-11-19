/** Comparison differences are already percentages in the API; they must never use a fraction formatter. */
import type { ComparisonRow } from "#/_archives/lib/site/governance/contracts";

export interface ComparisonDifference {
  value: string;
  note: string;
}

export function comparisonDifference(
  row: Pick<ComparisonRow, "a" | "b" | "diffPercent">,
  baselineName: string,
): ComparisonDifference {
  if (row.a === null || row.b === null) {
    return { value: "Not available", note: "Both figures are needed" };
  }
  if (row.b === 0) {
    return {
      value: "Not defined",
      note: "Relative percent is undefined when the baseline is zero",
    };
  }
  if (row.diffPercent == null) {
    return { value: "Not available", note: "Relative difference not recorded" };
  }
  return {
    value: `${row.diffPercent > 0 ? "+" : ""}${row.diffPercent.toFixed(1)}%`,
    note: `Relative to ${baselineName}`,
  };
}
