import type { LanguageCode } from "#/modules/shared/schema/type/language-code.type.ts";
import type { NonEmptyString100 } from "#/modules/shared/schema/type/non-empty-string100.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";
import type { RankRow } from "#/modules/frontend/schema/interface/rank-row.interface.ts";
import type { LocalizedText } from "#/modules/shared/schema/interface/localized-text.interface.ts";

/** Ranking Screen */
export interface RankingScreen {
  indicator: LocalizedText;
  language: LanguageCode;
  rows: RankRow[];
  unit?: NonEmptyString100 | null;
  year?: Year | null;
}
