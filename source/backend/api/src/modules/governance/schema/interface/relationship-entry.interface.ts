import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";
import type { RelationshipEntryNames } from "#/modules/governance/schema/interface/relationship-entry-names.interface.ts";

/** Relationship Entry */
export interface RelationshipEntry {
  fromCode: IdentityCode;
  fromId: Id;
  fromYear: Year | null;
  kindTerm: Id;
  names: RelationshipEntryNames[];
  toYear: Year | null;
}
