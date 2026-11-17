import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type EvidenceRef } from "#/lib/types/evidence-ref.ts";
import { type MediaRef } from "#/lib/types/media-ref.ts";

/** Office Holder */
export interface OfficeHolder {
  evidence: EvidenceRef[];
  holderId: string;
  leftOfficeOn?: string | null;
  officeCode: string;
  officeTitle: string;
  partyName?: string | null;
  personName: string;
  portrait?: MediaRef | null;
  tookOfficeOn?: string | null;
  unitFeatureId?: string | null;
  unitName?: string | null;
}

/** Field metadata for forms and results. */
export const OfficeHolderFields: readonly FieldMeta[] = [
  { name: "evidence", label: "Evidence", kind: "other", required: true },
  { name: "holderId", label: "Holder Id", kind: "string", required: true },
  { name: "leftOfficeOn", label: "Left Office On", kind: "date", required: false },
  { name: "officeCode", label: "Office Code", kind: "string", required: true },
  { name: "officeTitle", label: "Office Title", kind: "string", required: true },
  { name: "partyName", label: "Party Name", kind: "string", required: false },
  { name: "personName", label: "Person Name", kind: "string", required: true },
  { name: "portrait", label: "Portrait", kind: "other", required: false },
  { name: "tookOfficeOn", label: "Took Office On", kind: "date", required: false },
  { name: "unitFeatureId", label: "Unit Feature Id", kind: "string", required: false },
  { name: "unitName", label: "Unit Name", kind: "string", required: false },
];
