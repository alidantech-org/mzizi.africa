import { LegislatureTextOrigin } from "#sdk/types/legislature/enums/text-origin.ts";
import { LegislatureTextStatus } from "#sdk/types/legislature/enums/text-status.ts";

/** A title or summary of a bill, motion, speech or agenda item in one language. */
export interface LegislatureSummaries {
  agendaId?: string | null;
  billId?: string | null;
  countryId?: string | null;
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  languageId: string;
  motionId?: string | null;
  origin: LegislatureTextOrigin;
  speechId?: string | null;
  status: LegislatureTextStatus;
  text: string;
  updatedAt: string;
  version: number;
}
