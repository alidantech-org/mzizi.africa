import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { ChildEntryNames } from "#/modules/geography/schema/interface/child-entry-names.interface.ts";

/** Child Entry */
export interface ChildEntry {
  code: IdentityCode;
  featureId: Id;
  hierarchyId: Id | null;
  kindTerm: Id;
  levelId: Id | null;
  names: ChildEntryNames[];
}
