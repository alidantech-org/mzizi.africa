import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Leader Profile Media */
export interface LeaderProfileMedia {
  embedUrl?: string | null;
  kind: string;
  mimeType?: string | null;
  platform: string;
  stored: boolean;
  thumbnailUrl?: string | null;
  title: string;
  url: string;
}

/** Field metadata for forms and results. */
export const LeaderProfileMediaFields: readonly FieldMeta[] = [
  { name: "embedUrl", label: "Embed Url", kind: "string", required: false },
  { name: "kind", label: "Kind", kind: "string", required: true },
  { name: "mimeType", label: "Mime Type", kind: "string", required: false },
  { name: "platform", label: "Platform", kind: "string", required: true },
  { name: "stored", label: "Stored", kind: "boolean", required: true },
  {
    name: "thumbnailUrl",
    label: "Thumbnail Url",
    kind: "string",
    required: false,
  },
  { name: "title", label: "Title", kind: "string", required: true },
  { name: "url", label: "Url", kind: "string", required: true },
];
