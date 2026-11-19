import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type GovernanceTabsArmsInstitutions } from "#/lib/types/governance-tabs-arms-institutions.ts";

/** Governance Tabs Arms */
export interface GovernanceTabsArms {
  about: string;
  code: string;
  institutions: GovernanceTabsArmsInstitutions[];
  label: string;
}

/** Field metadata for forms and results. */
export const GovernanceTabsArmsFields: readonly FieldMeta[] = [
  { name: "about", label: "About", kind: "string", required: true },
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "institutions", label: "Institutions", kind: "other", required: true },
  { name: "label", label: "Label", kind: "string", required: true },
];
