
import type { Id } from "#/modules/shared/id.type.ts";
import type { IdentityCode } from "#/modules/shared/identity-code.type.ts";
import type { InstitutionEntryNames } from "#/modules/governance/institution-entry-names.interface.ts";

/** Institution Entry */
export interface InstitutionEntry {
  code: IdentityCode;
  id: Id;
  kind: IdentityCode;
  names: InstitutionEntryNames[];
}