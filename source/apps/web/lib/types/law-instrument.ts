import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Law Instrument */
export interface LawInstrument {
  code: string;
  enactedOn?: string | null;
  kindCode: string;
  kindLabel: string;
  name: string;
  provisions: number;
}

/** Field metadata for forms and results. */
export const LawInstrumentFields: readonly FieldMeta[] = [
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "enactedOn", label: "Enacted On", kind: "date", required: false },
  { name: "kindCode", label: "Kind Code", kind: "string", required: true },
  { name: "kindLabel", label: "Kind Label", kind: "string", required: true },
  { name: "name", label: "Name", kind: "string", required: true },
  { name: "provisions", label: "Provisions", kind: "number", required: true },
];
