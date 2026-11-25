import type { FrontendRankRow } from "#sdk/types/frontend/dto/rank-row.ts";
import type { SharedLocalizedText } from "#sdk/types/shared/dto/localized-text.ts";

/** Ranking Screen */
export interface FrontendRankingScreen {
  indicator: SharedLocalizedText;
  language: string;
  rows: FrontendRankRow[];
  unit?: string | null;
  year?: number | null;
}
