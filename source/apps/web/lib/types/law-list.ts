import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type LawInstrument } from "#/lib/types/law-instrument.ts";

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
