import { PoliticsCommitmentKind } from "#sdk/types/politics/enums/commitment-kind.ts";
import type { PoliticsCommitmentEntryFulfilments } from "#sdk/types/politics/dto/commitment-entry-fulfilments.ts";

/** Commitment Entry */
export interface PoliticsCommitmentEntry {
  code: string;
  commitmentId: string;
  dueOn: string | null;
  fulfilments: PoliticsCommitmentEntryFulfilments[];
  kind: PoliticsCommitmentKind;
  languageCode: string;
  madeOn: string | null;
  placeId: string | null;
  quantity: number | null;
  statement: string;
  statusAsOf: string | null;
  statusTerm: string;
  topicTerm: string | null;
}
