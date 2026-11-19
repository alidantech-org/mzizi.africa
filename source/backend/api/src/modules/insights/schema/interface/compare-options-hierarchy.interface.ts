import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";
import type { CompareOptionsHierarchyUnit } from "#/modules/insights/schema/interface/compare-options-hierarchy-unit.interface.ts";

/** Compare Options Hierarchy */
export interface CompareOptionsHierarchy {
  available: Flag;
  label: String;
  message?: String | null;
  rung: String;
  unit?: CompareOptionsHierarchyUnit | null;
}
