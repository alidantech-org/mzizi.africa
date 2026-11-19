import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Engagement */
export interface Engagement {
  liked: boolean;
  likes: number;
}

/** Field metadata for forms and results. */
export const EngagementFields: readonly FieldMeta[] = [
  { name: "liked", label: "Liked", kind: "boolean", required: true },
  { name: "likes", label: "Likes", kind: "number", required: true },
];
