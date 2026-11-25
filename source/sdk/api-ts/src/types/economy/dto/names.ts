import { EconomyNameKind } from "#sdk/types/economy/enums/name-kind.ts";

/** Names of a good in any language. */
export interface EconomyNames {
  countryId?: string | null;
  createdAt: string;
  deletedAt?: string | null;
  goodId: string;
  id: string;
  kind: EconomyNameKind;
  languageId: string;
  text: string;
  updatedAt: string;
  version: number;
}
