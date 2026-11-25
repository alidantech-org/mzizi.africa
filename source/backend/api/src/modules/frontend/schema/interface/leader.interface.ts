import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";
import type { LocalizedText } from "#/modules/shared/schema/interface/localized-text.interface.ts";

/** Leader */
export interface Leader {
  fromYear?: Year | null;
  office: IdentityCode;
  officeName: LocalizedText;
  person?: IdentityCode | null;
  personName?: LocalizedText;
}
