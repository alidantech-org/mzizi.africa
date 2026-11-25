import type { LabelKind } from "#/modules/vocabulary/schema/enum/label-kind.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { NonEmptyString1000 } from "#/modules/shared/schema/type/non-empty-string1000.type.ts";

/** Term Entry Labels */
export interface TermEntryLabels {
  countryId: Id | null;
  kind: LabelKind;
  languageCode: IdentityCode;
  text: NonEmptyString1000;
}
