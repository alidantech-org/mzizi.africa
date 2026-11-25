import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";
import type { PartyEntryNames } from "#/modules/politics/schema/interface/party-entry-names.interface.ts";

/** Party Entry */
export interface PartyEntry {
  code: IdentityCode;
  fromYear: Year | null;
  kindTerm: Id;
  names: PartyEntryNames[];
  partyId: Id;
  toYear: Year | null;
}
