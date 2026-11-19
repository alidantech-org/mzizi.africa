import type { String } from "#/modules/shared/schema/type/string.type.ts";

/** Party Detail Members */
export interface PartyDetailMembers {
  holderId?: String | null;
  individualId: String;
  leaderSlug?: String;
  name: String;
  office?: String | null;
  unit?: String | null;
  unitId?: String | null;
  unitPath?: String;
}
