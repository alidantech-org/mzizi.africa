import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type Manifesto } from "#/lib/types/manifesto.ts";

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
