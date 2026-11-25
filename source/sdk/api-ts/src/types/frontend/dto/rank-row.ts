import { SharedFigureStatus } from "#sdk/types/shared/enums/figure-status.ts";
import type { SharedLocalizedText } from "#sdk/types/shared/dto/localized-text.ts";

/** Rank Row */
export interface FrontendRankRow {
  name: SharedLocalizedText;
  place: string;
  rank?: number | null;
  status: SharedFigureStatus;
  value?: number | null;
}
