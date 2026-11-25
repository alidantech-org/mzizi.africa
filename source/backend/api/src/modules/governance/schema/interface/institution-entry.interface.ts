import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";
import type { InstitutionEntryNames } from "#/modules/governance/schema/interface/institution-entry-names.interface.ts";

/** Institution Entry */
export interface InstitutionEntry {
  armTerm: Id | null;
  classTerm: Id | null;
  code: IdentityCode;
  fromYear: Year | null;
  institutionId: Id;
  kindTerm: Id;
  names: InstitutionEntryNames[];
  toYear: Year | null;
}
