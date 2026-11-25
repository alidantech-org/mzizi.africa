import type { FigureBasis } from "#/modules/shared/schema/enum/figure-basis.enum.ts";
import type { FigureStatus } from "#/modules/shared/schema/enum/figure-status.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";
import type { Percentage } from "#/modules/shared/schema/type/percentage.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/** Tally Entry */
export interface TallyEntry {
  basis: FigureBasis;
  candidateId: Id | null;
  choiceId: Id | null;
  contestId: Id;
  refreshedAt: Instant;
  share: Percentage | null;
  status: FigureStatus;
  votes: NonNegativeInteger | null;
}
