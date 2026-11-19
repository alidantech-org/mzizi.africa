import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Fund */
export interface Fund {
  code: string;
  featureId?: string | null;
  flows: number;
  kind: string;
  manager?: string | null;
  path?: string | null;
  place?: string | null;
  source?: string | null;
}

/** Field metadata for forms and results. */
export const FundFields: readonly FieldMeta[] = [
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "featureId", label: "Feature Id", kind: "string", required: false },
  { name: "flows", label: "Flows", kind: "number", required: true },
  { name: "kind", label: "Kind", kind: "string", required: true },
  { name: "manager", label: "Manager", kind: "string", required: false },
  { name: "path", label: "Path", kind: "string", required: false },
  { name: "place", label: "Place", kind: "string", required: false },
  { name: "source", label: "Source", kind: "string", required: false },
];
