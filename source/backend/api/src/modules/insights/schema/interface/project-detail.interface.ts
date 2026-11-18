import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";

/** Project Detail */
export interface ProjectDetail {
  evidence: Record<string, unknown>[];
  gaps: NonEmptyString500[];
  media: Record<string, unknown>[];
  money: Record<string, unknown>[];
  procurement?: Record<string, unknown> | null;
  project: Record<string, unknown>;
}
