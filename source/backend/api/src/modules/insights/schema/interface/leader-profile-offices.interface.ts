import type { String } from "#/modules/shared/schema/type/string.type.ts";

/** Leader Profile Offices */
export interface LeaderProfileOffices {
  holderId: String;
  leaderSlug: String;
  leftOfficeOn?: String | null;
  office: String;
  tookOfficeOn: String;
  unit?: String | null;
}
