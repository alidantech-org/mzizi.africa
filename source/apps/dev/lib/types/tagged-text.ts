import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type TermHit } from "#/lib/types/term-hit.ts";

/** Tagged Text */
export interface TaggedText {
  hits: TermHit[];
  text: string;
}

/** Field metadata for forms and results. */
export const TaggedTextFields: readonly FieldMeta[] = [
  { name: "hits", label: "Hits", kind: "other", required: true },
  { name: "text", label: "Text", kind: "string", required: true },
];
