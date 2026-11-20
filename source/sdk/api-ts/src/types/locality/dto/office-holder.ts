import type { LocalityEvidenceRef } from "#sdk/types/locality/dto/evidence-ref.ts";
import type { LocalityMediaRef } from "#sdk/types/locality/dto/media-ref.ts";

/** Office Holder */
export interface LocalityOfficeHolder {
  evidence: LocalityEvidenceRef[];
  holderId: string;
  leftOfficeOn?: string | null;
  officeCode: string;
  officeTitle: string;
  partyName?: string | null;
  personName: string;
  portrait?: LocalityMediaRef | null;
  tookOfficeOn?: string | null;
  unitFeatureId?: string | null;
  unitName?: string | null;
}
