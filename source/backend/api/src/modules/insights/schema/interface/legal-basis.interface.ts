import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";

/** Legal Basis */
export interface LegalBasis {
  gaps: NonEmptyString500[];
  items: Record<string, unknown>[];
  subject: Record<string, unknown>;
}
