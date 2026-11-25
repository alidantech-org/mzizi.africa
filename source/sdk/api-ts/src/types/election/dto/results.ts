import { SharedFigureBasis } from "#sdk/types/shared/enums/figure-basis.ts";
import { SharedFigureStatus } from "#sdk/types/shared/enums/figure-status.ts";

/** Votes for exactly one candidate or one choice in one place, by collection and revision. */
export interface ElectionResults {
  basis: SharedFigureBasis;
  candidateId?: string | null;
  choiceId?: string | null;
  collectionId?: string | null;
  countryId: string;
  createdAt: string;
  deletedAt?: string | null;
  featureId: string;
  formId?: string | null;
  id: string;
  revision: number;
  status: SharedFigureStatus;
  supersedesId?: string | null;
  updatedAt: string;
  version: number;
  votes?: number | null;
}
