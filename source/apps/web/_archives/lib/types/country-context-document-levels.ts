import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Country Context Document Levels */
export interface CountryContextDocumentLevels {
  depth: number;
  id: string;
  kind: string;
  kindCode: string;
  rootFeatureId: string | null;
  routing: boolean;
}

/** Field metadata for forms and results. */
export const CountryContextDocumentLevelsFields: readonly FieldMeta[] = [
  { name: "depth", label: "Depth", kind: "number", required: true },
  { name: "id", label: "Id", kind: "string", required: true },
  { name: "kind", label: "Kind", kind: "string", required: true },
  { name: "kindCode", label: "Kind Code", kind: "string", required: true },
  {
    name: "rootFeatureId",
    label: "Root Feature Id",
    kind: "string",
    required: false,
  },
  { name: "routing", label: "Routing", kind: "boolean", required: true },
];
