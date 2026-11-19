import type { String } from "#/modules/shared/schema/type/string.type.ts";
import type { PlaceCivicLeadershipEvidence } from "#/modules/insights/schema/interface/place-civic-leadership-evidence.interface.ts";

/** Place Civic Leadership */
export interface PlaceCivicLeadership {
  evidence: PlaceCivicLeadershipEvidence[];
  holderId: String;
  leaderSlug: String;
  leftOfficeOn?: String | null;
  officeCode: String;
  officeTitle: String;
  partyName?: String | null;
  personName: String;
  portrait?: unknown | null;
  tookOfficeOn: String;
  unitFeatureId: String;
  unitName: String;
}
