import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";
import type { ProjectEntryNames } from "#/modules/civic/schema/interface/project-entry-names.interface.ts";

/** Project Entry */
export interface ProjectEntry {
  code: IdentityCode;
  fromYear: Year | null;
  names: ProjectEntryNames[];
  projectId: Id;
  siteKindTerm: Id;
  statusTerm: Id;
  toYear: Year | null;
}
