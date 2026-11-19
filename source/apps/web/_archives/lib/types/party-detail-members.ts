import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Party Detail Members */
export interface PartyDetailMembers {
  holderId?: string | null;
  individualId: string;
  leaderSlug?: string;
  name: string;
  office?: string | null;
  unit?: string | null;
  unitId?: string | null;
  unitPath?: string;
}

/** Field metadata for forms and results. */
export const PartyDetailMembersFields: readonly FieldMeta[] = [
  { name: "holderId", label: "Holder Id", kind: "string", required: false },
  {
    name: "individualId",
    label: "Individual Id",
    kind: "string",
    required: true,
  },
  { name: "leaderSlug", label: "Leader Slug", kind: "string", required: false },
  { name: "name", label: "Name", kind: "string", required: true },
  { name: "office", label: "Office", kind: "string", required: false },
  { name: "unit", label: "Unit", kind: "string", required: false },
  { name: "unitId", label: "Unit Id", kind: "string", required: false },
  { name: "unitPath", label: "Unit Path", kind: "string", required: false },
];
