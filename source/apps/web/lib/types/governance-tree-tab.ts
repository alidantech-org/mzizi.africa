import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Governance Tree Tab */
export interface GovernanceTreeTab {
  about: string;
  code: string;
  institution?: string | null;
  label: string;
}

/** Field metadata for forms and results. */
export const GovernanceTreeTabFields: readonly FieldMeta[] = [
  { name: "about", label: "About", kind: "string", required: true },
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "institution", label: "Institution", kind: "string", required: false },
  { name: "label", label: "Label", kind: "string", required: true },
];
