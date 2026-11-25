import { PoliticsCommitmentKind } from "#sdk/types/politics/enums/commitment-kind.ts";

/** A promise someone with public power made, in their original words, with its status. */
export interface PoliticsCommitments {
  code: string;
  countryId?: string | null;
  createdAt: string;
  deletedAt?: string | null;
  dueOn?: string | null;
  fromYear?: number | null;
  id: string;
  kind: PoliticsCommitmentKind;
  languageId: string;
  madeOn?: string | null;
  makerId: string;
  manifestoId?: string | null;
  occurrenceId?: string | null;
  officeId?: string | null;
  placeId?: string | null;
  quantity?: number | null;
  speechId?: string | null;
  statement: string;
  statusAsOf?: string | null;
  statusTerm: string;
  toYear?: number | null;
  topicTerm?: string | null;
  unitId?: string | null;
  updatedAt: string;
  version: number;
}
