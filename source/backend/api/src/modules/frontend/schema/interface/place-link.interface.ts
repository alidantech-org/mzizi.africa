import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { LocalizedText } from "#/modules/shared/schema/interface/localized-text.interface.ts";

/** Place Link */
export interface PlaceLink {
  code: IdentityCode;
  id: Id;
  kind?: LocalizedText;
  name: LocalizedText;
}
