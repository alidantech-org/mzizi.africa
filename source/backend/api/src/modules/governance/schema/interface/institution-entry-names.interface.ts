import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";

/** Institution Entry Names */
export interface InstitutionEntryNames {
  isPreferred: Flag;
  languageId: Id;
  name: Name;
}
