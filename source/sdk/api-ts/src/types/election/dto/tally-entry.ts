import { SharedFigureBasis } from "#sdk/types/shared/enums/figure-basis.ts";
import { SharedFigureStatus } from "#sdk/types/shared/enums/figure-status.ts";

/** Tally Entry */
export interface ElectionTallyEntry {
  basis: SharedFigureBasis;
  candidateId: string | null;
  choiceId: string | null;
  contestId: string;
  refreshedAt: string;
  share: number | null;
  status: SharedFigureStatus;
  votes: number | null;
}
