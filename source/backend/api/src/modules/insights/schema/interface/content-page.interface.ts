import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";

/** Content Page */
export interface ContentPage {
  content?: Record<string, unknown> | null;
  gaps: NonEmptyString500[];
  related: Record<string, unknown>[];
}
