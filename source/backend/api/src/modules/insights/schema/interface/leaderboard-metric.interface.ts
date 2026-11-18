import type { Code } from "#/modules/insights/schema/type/code.type.ts";
import type { Description } from "#/modules/shared/schema/type/description.type.ts";
import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { NonEmptyString100 } from "#/modules/shared/schema/type/non-empty-string100.type.ts";

/** Leaderboard Metric */
export interface LeaderboardMetric {
  code: Code;
  describe: Description;
  domain: NonEmptyString100;
  higherIsBetter: Flag;
  title: Name;
  unit?: NonEmptyString100 | null;
}
