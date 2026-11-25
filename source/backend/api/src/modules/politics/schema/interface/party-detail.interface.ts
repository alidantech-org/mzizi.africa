import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";
import type { PartyDetailCoalitions } from "#/modules/politics/schema/interface/party-detail-coalitions.interface.ts";
import type { PartyDetailNames } from "#/modules/politics/schema/interface/party-detail-names.interface.ts";

/** Party Detail */
export interface PartyDetail {
  coalitions: PartyDetailCoalitions[];
  code: IdentityCode;
  countryId: Id;
  fromYear: Year | null;
  kindTerm: Id;
  names: PartyDetailNames[];
  partyId: Id;
  toYear: Year | null;
}
