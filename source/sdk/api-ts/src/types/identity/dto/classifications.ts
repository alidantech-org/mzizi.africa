/** Dated answers to questions about a named thing (UN region, feature function, office selection). Mzizi's code checks the scheme's scopes and one-answer rule. */
export interface IdentityClassifications {
  classTerm: string;
  createdAt: string;
  deletedAt?: string | null;
  fromYear?: number | null;
  id: string;
  identityId: string;
  schemeId: string;
  toYear?: number | null;
  updatedAt: string;
  version: number;
}
