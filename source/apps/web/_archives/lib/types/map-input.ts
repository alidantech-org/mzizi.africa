import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Map Input */
export interface MapInput {
  indicatorCode: string;
  kindCode?: string;
  parentFeatureId?: string;
}

/** Field metadata for forms and results. */
export const MapInputFields: readonly FieldMeta[] = [
  {
    name: "indicatorCode",
    label: "Indicator Code",
    kind: "string",
    required: true,
  },
  { name: "kindCode", label: "Kind Code", kind: "string", required: false },
  {
    name: "parentFeatureId",
    label: "Parent Feature Id",
    kind: "string",
    required: false,
  },
];
