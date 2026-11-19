import type { String } from "#/modules/shared/schema/type/string.type.ts";

/** Leader Profile Leader */
export interface LeaderProfileLeader {
  birthDate: String;
  holderId: String;
  individualId: String;
  institution: String;
  leaderSlug: String;
  name: String;
  office: String;
  party?: String | null;
  tookOfficeOn: String;
  unit?: String | null;
  unitId?: String | null;
  unitPath?: String;
}
