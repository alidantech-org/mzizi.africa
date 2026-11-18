import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";

/** Content List */
export interface ContentList {
  categories: Record<string, unknown>[];
  gaps: NonEmptyString500[];
  items: Record<string, unknown>[];
}
