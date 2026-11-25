import { SharedFigureBasis } from "#sdk/types/shared/enums/figure-basis.ts";
import { SharedFigureStatus } from "#sdk/types/shared/enums/figure-status.ts";
import type { SharedLocalizedText } from "#sdk/types/shared/dto/localized-text.ts";

/** Figure */
export interface FrontendFigure {
  basis: SharedFigureBasis;
  decimals?: number | null;
  fromYear?: number | null;
  indicator: string;
  label: SharedLocalizedText;
  lower?: number | null;
  status: SharedFigureStatus;
  toYear?: number | null;
  unit?: string | null;
  upper?: number | null;
  value?: number | null;
}
