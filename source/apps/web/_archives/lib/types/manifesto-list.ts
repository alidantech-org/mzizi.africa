import type { FieldMeta } from "#/_archives/lib/dryv/transport";
import { type Manifesto } from "#/_archives/lib/types/manifesto";

/** Manifesto List */
export interface ManifestoList {
  gaps: string[];
  manifestos: Manifesto[];
}

/** Field metadata for forms and results. */
export const ManifestoListFields: readonly FieldMeta[] = [
  { name: "gaps", label: "Gaps", kind: "string", required: true },
  { name: "manifestos", label: "Manifestos", kind: "other", required: true },
];
