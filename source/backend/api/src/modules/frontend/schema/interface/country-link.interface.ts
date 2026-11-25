import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { NonEmptyString100 } from "#/modules/shared/schema/type/non-empty-string100.type.ts";
import type { LocalizedText } from "#/modules/shared/schema/interface/localized-text.interface.ts";

/** Country Link */
export interface CountryLink {
  code: IdentityCode;
  id: Id;
  isoAlpha2?: NonEmptyString100 | null;
  name: LocalizedText;
}
