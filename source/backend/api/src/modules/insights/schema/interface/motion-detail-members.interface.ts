import type { String } from "#/modules/shared/schema/type/string.type.ts";

/** Motion Detail Members */
export interface MotionDetailMembers {
  holderId: String;
  individualId: String;
  leaderSlug: String;
  name: String;
  office: String;
  party?: String | null;
  partyCode?: String | null;
  position: String;
  unit?: String | null;
}
