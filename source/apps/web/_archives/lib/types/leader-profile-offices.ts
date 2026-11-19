import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Leader Profile Offices */
export interface LeaderProfileOffices {
  holderId: string;
  leaderSlug: string;
  leftOfficeOn?: string | null;
  office: string;
  tookOfficeOn: string;
  unit?: string | null;
}

/** Field metadata for forms and results. */
export const LeaderProfileOfficesFields: readonly FieldMeta[] = [
  { name: "holderId", label: "Holder Id", kind: "string", required: true },
  { name: "leaderSlug", label: "Leader Slug", kind: "string", required: true },
  {
    name: "leftOfficeOn",
    label: "Left Office On",
    kind: "string",
    required: false,
  },
  { name: "office", label: "Office", kind: "string", required: true },
  {
    name: "tookOfficeOn",
    label: "Took Office On",
    kind: "string",
    required: true,
  },
  { name: "unit", label: "Unit", kind: "string", required: false },
];
