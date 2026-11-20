/** One named public fund with a classification, manager and country. */
export interface FinanceFunds {
  code: string;
  countryId?: string | null;
  createdAt: string;
  deletedAt?: string | null;
  fundKindId: string;
  fundingSourceId?: string | null;
  id: string;
  managingEntityId?: string | null;
  scopeUnitFeatureId?: string | null;
  sourceCitationId?: string | null;
  updatedAt: string;
  version: number;
}
