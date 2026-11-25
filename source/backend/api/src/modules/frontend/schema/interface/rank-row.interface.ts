import type { FigureStatus } from "#/modules/shared/schema/enum/figure-status.enum.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { LocalizedText } from "#/modules/shared/schema/interface/localized-text.interface.ts";

/** Rank Row */
export interface RankRow {
  name: LocalizedText;
  place: IdentityCode;
  rank?: PositiveInteger | null;
  status: FigureStatus;
  value?: Number | null;
}
