import { SharedFigureBasis } from "#sdk/types/shared/enums/figure-basis.ts";
import { SharedFigureStatus } from "#sdk/types/shared/enums/figure-status.ts";

/** Prepared: the one result to show per contest, option and place, chosen by the country's priorities (IEBC first). */
export interface ElectionTallies {
  basis: SharedFigureBasis;
  candidateId?: string | null;
  choiceId?: string | null;
  contestId: string;
  countryId: string;
  createdAt: string;
  featureId: string;
  id: string;
  refreshedAt: string;
  resultId: string;
  share?: number | null;
  status: SharedFigureStatus;
  votes?: number | null;
}
