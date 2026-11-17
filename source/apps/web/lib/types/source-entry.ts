import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Source Entry */
export interface SourceEntry {
  artifactCount: number;
  citationCount: number;
  code: string;
  name: string;
  publisherName?: string | null;
  sourceId: string;
}

/** Field metadata for forms and results. */
export const SourceEntryFields: readonly FieldMeta[] = [
  { name: "artifactCount", label: "Artifact Count", kind: "number", required: true },
  { name: "citationCount", label: "Citation Count", kind: "number", required: true },
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "name", label: "Name", kind: "string", required: true },
  { name: "publisherName", label: "Publisher Name", kind: "string", required: false },
  { name: "sourceId", label: "Source Id", kind: "string", required: true },
];
