import type { FieldMeta } from "#/_archives/lib/dryv/transport";
import { type InstitutionDetailLeadersHow } from "#/_archives/lib/types/institution-detail-leaders-how";
import { type InstitutionDetailLeadersTier } from "#/_archives/lib/types/institution-detail-leaders-tier";
import { type InstitutionDetailLeadersUnit } from "#/_archives/lib/types/institution-detail-leaders-unit";

/** Institution Detail Leaders */
export interface InstitutionDetailLeaders {
  holderId: string;
  how: InstitutionDetailLeadersHow;
  leaderSlug: string;
  name: string;
  officeCode: string;
  party?: string | null;
  photo: string;
  since: string;
  tier: InstitutionDetailLeadersTier;
  unit?: InstitutionDetailLeadersUnit | null;
}

/** Field metadata for forms and results. */
export const InstitutionDetailLeadersFields: readonly FieldMeta[] = [
  { name: "holderId", label: "Holder Id", kind: "string", required: true },
  { name: "how", label: "How", kind: "other", required: true },
  { name: "leaderSlug", label: "Leader Slug", kind: "string", required: true },
  { name: "name", label: "Name", kind: "string", required: true },
  { name: "officeCode", label: "Office Code", kind: "string", required: true },
  { name: "party", label: "Party", kind: "string", required: false },
  { name: "photo", label: "Photo", kind: "string", required: true },
  { name: "since", label: "Since", kind: "string", required: true },
  { name: "tier", label: "Tier", kind: "other", required: true },
  { name: "unit", label: "Unit", kind: "other", required: false },
];
