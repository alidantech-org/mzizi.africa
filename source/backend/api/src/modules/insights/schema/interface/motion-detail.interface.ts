import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";

/** Motion Detail */
export interface MotionDetail {
  gaps: NonEmptyString500[];
  legal?: Record<string, unknown> | null;
  members: Record<string, unknown>[];
  motion: Record<string, unknown>;
  parties: Record<string, unknown>[];
  tally: Record<string, unknown>;
}
