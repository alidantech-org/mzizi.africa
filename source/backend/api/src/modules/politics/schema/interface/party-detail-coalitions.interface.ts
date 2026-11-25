import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";

/** Party Detail Coalitions */
export interface PartyDetailCoalitions {
  coalitionId: Id;
  code: IdentityCode;
  fromYear: Year | null;
  kindTerm: Id;
  toYear: Year | null;
}
