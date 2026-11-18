import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Search Hit */
export interface SearchHit {
  code?: string | null;
  featureId?: string | null;
  id: string;
  imageUrl?: string | null;
  kind: string;
  kindLabel: string;
  path: string[];
  subtitle?: string | null;
  title: string;
}

/** Field metadata for forms and results. */
export const SearchHitFields: readonly FieldMeta[] = [
  { name: "code", label: "Code", kind: "string", required: false },
  { name: "featureId", label: "Feature Id", kind: "string", required: false },
  { name: "id", label: "Id", kind: "string", required: true },
  { name: "imageUrl", label: "Image Url", kind: "string", required: false },
  { name: "kind", label: "Kind", kind: "string", required: true },
  { name: "kindLabel", label: "Kind Label", kind: "string", required: true },
  { name: "path", label: "Path", kind: "string", required: true },
  { name: "subtitle", label: "Subtitle", kind: "string", required: false },
  { name: "title", label: "Title", kind: "string", required: true },
];
