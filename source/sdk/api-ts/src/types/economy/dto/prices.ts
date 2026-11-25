import { EconomyPriceKind } from "#sdk/types/economy/enums/price-kind.ts";
import { SharedFigureBasis } from "#sdk/types/shared/enums/figure-basis.ts";
import { SharedFigureStatus } from "#sdk/types/shared/enums/figure-status.ts";

/** One observed, reference or modelled price of a good at a place and time. */
export interface EconomyPrices {
  amount?: number | null;
  basis: SharedFigureBasis;
  collectionId?: string | null;
  countryId: string;
  createdAt: string;
  currencyId: string;
  deletedAt?: string | null;
  endsOn?: string | null;
  featureId?: string | null;
  fromYear?: number | null;
  goodId: string;
  id: string;
  kind: EconomyPriceKind;
  revision: number;
  startsOn?: string | null;
  status: SharedFigureStatus;
  supersedesId?: string | null;
  toYear?: number | null;
  updatedAt: string;
  version: number;
}
