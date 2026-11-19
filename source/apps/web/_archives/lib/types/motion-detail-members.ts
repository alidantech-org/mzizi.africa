import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Motion Detail Members */
export interface MotionDetailMembers {
  holderId: string;
  individualId: string;
  leaderSlug: string;
  name: string;
  office: string;
  party?: string | null;
  partyCode?: string | null;
  position: string;
  unit?: string | null;
}

/** Field metadata for forms and results. */
export const MotionDetailMembersFields: readonly FieldMeta[] = [
  { name: "holderId", label: "Holder Id", kind: "string", required: true },
  {
    name: "individualId",
    label: "Individual Id",
    kind: "string",
    required: true,
  },
  { name: "leaderSlug", label: "Leader Slug", kind: "string", required: true },
  { name: "name", label: "Name", kind: "string", required: true },
  { name: "office", label: "Office", kind: "string", required: true },
  { name: "party", label: "Party", kind: "string", required: false },
  { name: "partyCode", label: "Party Code", kind: "string", required: false },
  { name: "position", label: "Position", kind: "string", required: true },
  { name: "unit", label: "Unit", kind: "string", required: false },
];
