import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type Budget } from "#/lib/types/budget.ts";

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
