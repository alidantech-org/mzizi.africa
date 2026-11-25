import type { IdentityKind } from "#/modules/shared/schema/enum/identity-kind.enum.ts";
import type { NameText } from "#/modules/identity/schema/type/name-text.type.ts";
import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";

/** Name Match */
export interface NameMatch {
  code: IdentityCode;
  identityId: Id;
  isDefault: Flag;
  kind: IdentityKind;
  languageCode: IdentityCode;
  text: NameText;
}
