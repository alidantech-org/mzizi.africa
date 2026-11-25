import { EconomyCrosswalkKind } from "#sdk/types/economy/enums/crosswalk-kind.ts";

/** Official correspondence tables between classifications (UN CPC to COICOP, HS). */
export interface EconomyCrosswalks {
  createdAt: string;
  deletedAt?: string | null;
  fromSchemeTerm: string;
  fromValue: string;
  id: string;
  kind: EconomyCrosswalkKind;
  toSchemeTerm: string;
  toValue: string;
}
