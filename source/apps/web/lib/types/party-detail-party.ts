import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Party Detail Party */
export interface PartyDetailParty {
  code: string;
  media: unknown[];
  name: string;
  registeredOn?: string | null;
}

/** Field metadata for forms and results. */
export const PartyDetailPartyFields: readonly FieldMeta[] = [
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "media", label: "Media", kind: "other", required: true },
  { name: "name", label: "Name", kind: "string", required: true },
  { name: "registeredOn", label: "Registered On", kind: "string", required: false },
];
