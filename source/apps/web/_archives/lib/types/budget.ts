import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Budget */
export interface Budget {
  code: string;
  entity?: string | null;
  fiscalFrom?: string | null;
  fiscalTo?: string | null;
  kind: string;
  latestReleasedOn?: string | null;
  revisions: number;
}

/** Field metadata for forms and results. */
export const BudgetFields: readonly FieldMeta[] = [
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "entity", label: "Entity", kind: "string", required: false },
  { name: "fiscalFrom", label: "Fiscal From", kind: "string", required: false },
  { name: "fiscalTo", label: "Fiscal To", kind: "string", required: false },
  { name: "kind", label: "Kind", kind: "string", required: true },
  {
    name: "latestReleasedOn",
    label: "Latest Released On",
    kind: "string",
    required: false,
  },
  { name: "revisions", label: "Revisions", kind: "number", required: true },
];
