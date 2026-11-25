import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { LocalizedText } from "#/modules/shared/schema/interface/localized-text.interface.ts";

/** Project Link */
export interface ProjectLink {
  code: IdentityCode;
  name: LocalizedText;
  status?: LocalizedText;
}
