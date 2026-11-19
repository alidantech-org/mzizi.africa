import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Party List Parties */
export interface PartyListParties {
  code: string;
  fundAllocationKes?: number | null;
  members: number;
  name: string;
  officeHolders: number;
  votes2022: number;
}

/** Field metadata for forms and results. */
export const PartyListPartiesFields: readonly FieldMeta[] = [
  { name: "code", label: "Code", kind: "string", required: true },
  {
    name: "fundAllocationKes",
    label: "Fund Allocation Kes",
    kind: "number",
    required: false,
  },
  { name: "members", label: "Members", kind: "number", required: true },
  { name: "name", label: "Name", kind: "string", required: true },
  {
    name: "officeHolders",
    label: "Office Holders",
    kind: "number",
    required: true,
  },
  { name: "votes2022", label: "Votes2022", kind: "number", required: true },
];
