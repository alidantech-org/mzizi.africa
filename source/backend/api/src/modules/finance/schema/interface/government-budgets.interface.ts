import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Integer } from "#/modules/shared/schema/type/integer.type.ts";

/** Government Budgets */
export interface GovernmentBudgets {
  governmentId: Id;
  limit?: Integer;
  offset?: Integer;
}
