import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";

/** Institution Detail */
export interface InstitutionDetail {
  children: Record<string, unknown>[];
  content: Record<string, unknown>[];
  gaps: NonEmptyString500[];
  institution: Record<string, unknown>;
  leaders: Record<string, unknown>[];
  legalBasis: Record<string, unknown>[];
  metrics: Record<string, unknown>[];
  parents: Record<string, unknown>[];
}
