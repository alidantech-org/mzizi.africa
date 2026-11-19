import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type GovernanceTabsArmsInstitutionsKind } from "#/lib/types/governance-tabs-arms-institutions-kind.ts";

/** Governance Tabs Arms Institutions */
export interface GovernanceTabsArmsInstitutions {
  code: string;
  image?: string | null;
  kind: GovernanceTabsArmsInstitutionsKind;
  leaders: number;
  name: string;
}

/** Field metadata for forms and results. */
export const GovernanceTabsArmsInstitutionsFields: readonly FieldMeta[] = [
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "image", label: "Image", kind: "string", required: false },
  { name: "kind", label: "Kind", kind: "other", required: true },
  { name: "leaders", label: "Leaders", kind: "number", required: true },
  { name: "name", label: "Name", kind: "string", required: true },
];
