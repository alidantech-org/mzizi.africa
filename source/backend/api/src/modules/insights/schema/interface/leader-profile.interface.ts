import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";

/** Leader Profile */
export interface LeaderProfile {
  activity: Record<string, unknown>;
  contacts: Record<string, unknown>[];
  election: Record<string, unknown>[];
  evidence: Record<string, unknown>[];
  fund?: Record<string, unknown> | null;
  gaps: NonEmptyString500[];
  leader: Record<string, unknown>;
  media: Record<string, unknown>[];
  offices: Record<string, unknown>[];
}
