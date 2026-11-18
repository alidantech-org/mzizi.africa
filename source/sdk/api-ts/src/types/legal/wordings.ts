import { SharedDatePrecision } from "#sdk/types/enums/shared/date-precision.ts";

/** Exact authority-bearing text of one provision in one edition and language. Translations are separate rows. */
export interface LegalWordings {
  citationId?: string | null;
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  editionId: string;
  endsOn?: string | null;
  fromToPrecision?: SharedDatePrecision | null;
  fromYear?: number | null;
  id: string;
  instrumentId: string;
  languageId: string;
  observedAt: string;
  provisionId: string;
  startsOn?: string | null;
  supersedesId?: string | null;
  text: string;
  toYear?: number | null;
  updatedAt: string;
  version: number;
}
