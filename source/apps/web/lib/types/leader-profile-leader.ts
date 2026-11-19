import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Leader Profile Leader */
export interface LeaderProfileLeader {
  birthDate: string;
  holderId: string;
  individualId: string;
  institution: string;
  leaderSlug: string;
  name: string;
  office: string;
  party?: string | null;
  tookOfficeOn: string;
  unit?: string | null;
  unitId?: string | null;
  unitPath?: string;
}

/** Field metadata for forms and results. */
export const LeaderProfileLeaderFields: readonly FieldMeta[] = [
  { name: "birthDate", label: "Birth Date", kind: "string", required: true },
  { name: "holderId", label: "Holder Id", kind: "string", required: true },
  { name: "individualId", label: "Individual Id", kind: "string", required: true },
  { name: "institution", label: "Institution", kind: "string", required: true },
  { name: "leaderSlug", label: "Leader Slug", kind: "string", required: true },
  { name: "name", label: "Name", kind: "string", required: true },
  { name: "office", label: "Office", kind: "string", required: true },
  { name: "party", label: "Party", kind: "string", required: false },
  { name: "tookOfficeOn", label: "Took Office On", kind: "string", required: true },
  { name: "unit", label: "Unit", kind: "string", required: false },
  { name: "unitId", label: "Unit Id", kind: "string", required: false },
  { name: "unitPath", label: "Unit Path", kind: "string", required: false },
];
