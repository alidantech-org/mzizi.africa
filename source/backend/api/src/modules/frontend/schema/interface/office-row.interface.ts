import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";
import type { LocalizedText } from "#/modules/shared/schema/interface/localized-text.interface.ts";

/** Office Row */
export interface OfficeRow {
  fromYear?: Year | null;
  holder?: LocalizedText;
  holderCode?: IdentityCode | null;
  name: LocalizedText;
  office: IdentityCode;
}
