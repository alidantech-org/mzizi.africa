import type { String } from "#/modules/shared/schema/type/string.type.ts";

/** Party Detail Party */
export interface PartyDetailParty {
  code: String;
  media: unknown[];
  name: String;
  registeredOn?: String | null;
}
