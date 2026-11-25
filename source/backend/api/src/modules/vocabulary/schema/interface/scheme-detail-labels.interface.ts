import type { LabelKind } from "#/modules/vocabulary/schema/enum/label-kind.enum.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { NonEmptyString1000 } from "#/modules/shared/schema/type/non-empty-string1000.type.ts";

/** Scheme Detail Labels */
export interface SchemeDetailLabels {
  kind: LabelKind;
  languageCode: IdentityCode;
  text: NonEmptyString1000;
}
