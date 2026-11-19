import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Governance Tabs Tabs */
export interface GovernanceTabsTabs {
  about: string;
  code: string;
  count: number;
  includes: string[];
  kind: string;
  label: string;
}

/** Field metadata for forms and results. */
export const GovernanceTabsTabsFields: readonly FieldMeta[] = [
  { name: "about", label: "About", kind: "string", required: true },
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "count", label: "Count", kind: "number", required: true },
  { name: "includes", label: "Includes", kind: "string", required: true },
  { name: "kind", label: "Kind", kind: "string", required: true },
  { name: "label", label: "Label", kind: "string", required: true },
];
