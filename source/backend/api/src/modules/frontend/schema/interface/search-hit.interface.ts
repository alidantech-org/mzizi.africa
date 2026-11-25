import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { NonEmptyString100 } from "#/modules/shared/schema/type/non-empty-string100.type.ts";
import type { LocalizedText } from "#/modules/shared/schema/interface/localized-text.interface.ts";

/** Search Hit */
export interface SearchHit {
  code: IdentityCode;
  context?: LocalizedText;
  kind: NonEmptyString100;
  name: LocalizedText;
}
