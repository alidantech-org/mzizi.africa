import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Leader Profile */
export interface LeaderProfile {
  activity: unknown;
  contacts: unknown[];
  election: unknown[];
  evidence: unknown[];
  fund?: unknown | null;
  gaps: string[];
  leader: unknown;
  media: unknown[];
  offices: unknown[];
}

/** Field metadata for forms and results. */
export const LeaderProfileFields: readonly FieldMeta[] = [
  { name: "activity", label: "Activity", kind: "other", required: true },
  { name: "contacts", label: "Contacts", kind: "other", required: true },
  { name: "election", label: "Election", kind: "other", required: true },
  { name: "evidence", label: "Evidence", kind: "other", required: true },
  { name: "fund", label: "Fund", kind: "other", required: false },
  { name: "gaps", label: "Gaps", kind: "string", required: true },
  { name: "leader", label: "Leader", kind: "other", required: true },
  { name: "media", label: "Media", kind: "other", required: true },
  { name: "offices", label: "Offices", kind: "other", required: true },
];
