import type { FieldMeta } from "#/_archives/lib/dryv/transport";
import { type LawInstrument } from "#/_archives/lib/types/law-instrument";

/** Law List */
export interface LawList {
  gaps: string[];
  instruments: LawInstrument[];
}

/** Field metadata for forms and results. */
export const LawListFields: readonly FieldMeta[] = [
  { name: "gaps", label: "Gaps", kind: "string", required: true },
  { name: "instruments", label: "Instruments", kind: "other", required: true },
];
