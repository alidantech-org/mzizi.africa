import type { String } from "#/modules/shared/schema/type/string.type.ts";

/** Leader Profile Contacts */
export interface LeaderProfileContacts {
  kind: String;
  scope: String;
  value: String;
  visibility: String;
}
