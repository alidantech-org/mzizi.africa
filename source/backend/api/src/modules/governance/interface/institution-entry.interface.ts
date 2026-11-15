
import type { Id } from "#/modules/shared/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/type/identity-code.type.ts";
import type { InstitutionEntryNames } from "#/modules/governance/interface/institution-entry-names.interface.ts";

/** Institution Entry */
export interface InstitutionEntry {
  code: IdentityCode;
  id: Id;
  kind: IdentityCode;
  names: InstitutionEntryNames[];
}