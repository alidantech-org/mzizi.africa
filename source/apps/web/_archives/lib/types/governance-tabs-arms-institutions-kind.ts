import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Governance Tabs Arms Institutions Kind */
export interface GovernanceTabsArmsInstitutionsKind {
  code: string;
  label: string;
}

/** Field metadata for forms and results. */
export const GovernanceTabsArmsInstitutionsKindFields: readonly FieldMeta[] = [
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "label", label: "Label", kind: "string", required: true },
];
