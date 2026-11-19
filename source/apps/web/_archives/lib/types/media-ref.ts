import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Media Ref */
export interface MediaRef {
  fileVersionId: string;
  kind: string;
  mimeType?: string | null;
  title?: string | null;
  url?: string | null;
}

/** Field metadata for forms and results. */
export const MediaRefFields: readonly FieldMeta[] = [
  {
    name: "fileVersionId",
    label: "File Version Id",
    kind: "string",
    required: true,
  },
  { name: "kind", label: "Kind", kind: "string", required: true },
  { name: "mimeType", label: "Mime Type", kind: "string", required: false },
  { name: "title", label: "Title", kind: "string", required: false },
  { name: "url", label: "Url", kind: "string", required: false },
];
