import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/** Leaderboard Row */
export interface LeaderboardRow {
  detail?: NonEmptyString500 | null;
  featureId?: Id | null;
  name: Name;
  rank: PositiveInteger;
  share?: Number | null;
  subjectId?: Id | null;
  value: Number;
}
