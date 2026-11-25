import type { NameText } from "#/modules/identity/schema/type/name-text.type.ts";
import type { Iso6391 } from "#/modules/reference/schema/type/iso6391.type.ts";
import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";

/** Bill Entry Names */
export interface BillEntryNames {
  fromYear: Year | null;
  isDefault: Flag;
  kindTerm: Id;
  languageCode: IdentityCode;
  languageIso: Iso6391 | null;
  text: NameText;
  toYear: Year | null;
}
