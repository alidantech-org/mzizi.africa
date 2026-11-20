import type { InsightsPlaceCivicLeadershipEvidence } from "#sdk/types/insights/dto/place-civic-leadership-evidence.ts";

/** Place Civic Leadership */
export interface InsightsPlaceCivicLeadership {
  evidence: InsightsPlaceCivicLeadershipEvidence[];
  holderId: string;
  leaderSlug: string;
  leftOfficeOn?: string | null;
  officeCode: string;
  officeTitle: string;
  partyName?: string | null;
  personName: string;
  portrait?: unknown | null;
  tookOfficeOn: string;
  unitFeatureId: string;
  unitName: string;
}
