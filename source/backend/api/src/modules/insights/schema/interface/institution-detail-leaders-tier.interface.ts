import type { String } from "#/modules/shared/schema/type/string.type.ts";

/** Institution Detail Leaders Tier */
export interface InstitutionDetailLeadersTier {
  code: String;
  label: String;
  parent?: String | null;
}
