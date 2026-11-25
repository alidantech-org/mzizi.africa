import type { TermStatus } from "#/modules/vocabulary/schema/enum/term-status.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { ColorToken } from "#/modules/vocabulary/schema/type/color-token.type.ts";
import type { IconCode } from "#/modules/vocabulary/schema/type/icon-code.type.ts";
import type { TermEntryLabels } from "#/modules/vocabulary/schema/interface/term-entry-labels.interface.ts";

/** Term Entry */
export interface TermEntry {
  code: IdentityCode;
  colorToken: ColorToken | null;
  iconCode: IconCode | null;
  labels: TermEntryLabels[];
  lower: Number | null;
  parentId: Id | null;
  position: NonNegativeInteger | null;
  status: TermStatus;
  termId: Id;
  upper: Number | null;
}
