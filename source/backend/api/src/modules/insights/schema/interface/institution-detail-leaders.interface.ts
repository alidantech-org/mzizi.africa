import type { String } from "#/modules/shared/schema/type/string.type.ts";
import type { InstitutionDetailLeadersHow } from "#/modules/insights/schema/interface/institution-detail-leaders-how.interface.ts";
import type { InstitutionDetailLeadersTier } from "#/modules/insights/schema/interface/institution-detail-leaders-tier.interface.ts";
import type { InstitutionDetailLeadersUnit } from "#/modules/insights/schema/interface/institution-detail-leaders-unit.interface.ts";

/** Institution Detail Leaders */
export interface InstitutionDetailLeaders {
  holderId: String;
  how: InstitutionDetailLeadersHow;
  leaderSlug: String;
  name: String;
  officeCode: String;
  party?: String | null;
  photo: String;
  since: String;
  tier: InstitutionDetailLeadersTier;
  unit?: InstitutionDetailLeadersUnit | null;
}
