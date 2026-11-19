import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type PlaceCivicLeadershipEvidence } from "#/lib/types/place-civic-leadership-evidence.ts";

/** Place Civic Leadership */
export interface PlaceCivicLeadership {
  evidence: PlaceCivicLeadershipEvidence[];
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

/** Field metadata for forms and results. */
export const PlaceCivicLeadershipFields: readonly FieldMeta[] = [
  { name: "evidence", label: "Evidence", kind: "other", required: true },
  { name: "holderId", label: "Holder Id", kind: "string", required: true },
  { name: "leaderSlug", label: "Leader Slug", kind: "string", required: true },
  { name: "leftOfficeOn", label: "Left Office On", kind: "string", required: false },
  { name: "officeCode", label: "Office Code", kind: "string", required: true },
  { name: "officeTitle", label: "Office Title", kind: "string", required: true },
  { name: "partyName", label: "Party Name", kind: "string", required: false },
  { name: "personName", label: "Person Name", kind: "string", required: true },
  { name: "portrait", label: "Portrait", kind: "other", required: false },
  { name: "tookOfficeOn", label: "Took Office On", kind: "string", required: true },
  { name: "unitFeatureId", label: "Unit Feature Id", kind: "string", required: true },
  { name: "unitName", label: "Unit Name", kind: "string", required: true },
];
