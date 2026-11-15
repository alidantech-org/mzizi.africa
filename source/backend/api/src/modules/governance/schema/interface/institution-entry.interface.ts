import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { InstitutionEntryNames } from "#/modules/governance/schema/interface/institution-entry-names.interface.ts";

/** Institution Entry */
export interface InstitutionEntry {
  code: IdentityCode;
  id: Id;
  kind: IdentityCode;
  names: InstitutionEntryNames[];
}
