import type { InsightsCompareOptionsHierarchyUnit } from "#sdk/types/insights/dto/compare-options-hierarchy-unit.ts";

/** Compare Options Hierarchy */
export interface InsightsCompareOptionsHierarchy {
  available: boolean;
  label: string;
  message?: string | null;
  rung: string;
  unit?: InsightsCompareOptionsHierarchyUnit | null;
}
