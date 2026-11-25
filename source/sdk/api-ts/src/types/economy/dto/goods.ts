import { EconomyGoodKind } from "#sdk/types/economy/enums/good-kind.ts";
import { EconomyGoodStatus } from "#sdk/types/economy/enums/good-status.ts";

/** The catalogue of goods, services and works ("Cement, 50 kg bag, grade 42.5N"). */
export interface EconomyGoods {
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  kind: EconomyGoodKind;
  parentId?: string | null;
  size?: number | null;
  sizeUnitId?: string | null;
  standardTerm?: string | null;
  status: EconomyGoodStatus;
  unitId?: string | null;
  updatedAt: string;
  version: number;
}
