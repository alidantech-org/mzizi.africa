import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";
import type { EraEntryNames } from "#/modules/history/schema/interface/era-entry-names.interface.ts";

/** Era Entry */
export interface EraEntry {
  code: IdentityCode;
  eraId: Id;
  fromYear: Year | null;
  kindTerm: Id;
  names: EraEntryNames[];
  parentId: Id | null;
  toYear: Year | null;
}
