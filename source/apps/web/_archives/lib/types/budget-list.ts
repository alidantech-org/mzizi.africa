import type { FieldMeta } from "#/_archives/lib/dryv/transport";
import { type Budget } from "#/_archives/lib/types/budget";

/** Budget List */
export interface BudgetList {
  budgets: Budget[];
  gaps: string[];
}

/** Field metadata for forms and results. */
export const BudgetListFields: readonly FieldMeta[] = [
  { name: "budgets", label: "Budgets", kind: "other", required: true },
  { name: "gaps", label: "Gaps", kind: "string", required: true },
];
