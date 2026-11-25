import type { FigureBasis } from "#/modules/shared/schema/enum/figure-basis.enum.ts";
import type { FigureStatus } from "#/modules/shared/schema/enum/figure-status.enum.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { NonEmptyString100 } from "#/modules/shared/schema/type/non-empty-string100.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";
import type { LocalizedText } from "#/modules/shared/schema/interface/localized-text.interface.ts";

/** Figure */
export interface Figure {
  basis: FigureBasis;
  decimals?: NonNegativeInteger | null;
  fromYear?: Year | null;
  indicator: IdentityCode;
  label: LocalizedText;
  lower?: Number | null;
  status: FigureStatus;
  toYear?: Year | null;
  unit?: NonEmptyString100 | null;
  upper?: Number | null;
  value?: Number | null;
}
