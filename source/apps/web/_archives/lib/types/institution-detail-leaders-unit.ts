import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Institution Detail Leaders Unit */
export interface InstitutionDetailLeadersUnit {
  featureId: string;
  name: string;
}

/** Field metadata for forms and results. */
export const InstitutionDetailLeadersUnitFields: readonly FieldMeta[] = [
  { name: "featureId", label: "Feature Id", kind: "string", required: true },
  { name: "name", label: "Name", kind: "string", required: true },
];
