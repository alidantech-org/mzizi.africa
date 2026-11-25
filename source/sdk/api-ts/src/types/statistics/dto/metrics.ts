import { SharedIdentityKind } from "#sdk/types/shared/enums/identity-kind.ts";

/** A figure calculated from indicators (a rate per 1,000); computed when `figures` is refreshed. */
export interface StatisticsMetrics {
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  denominatorId?: string | null;
  higherIsBetter?: boolean | null;
  id: string;
  identityKind: SharedIdentityKind;
  isRankable: boolean;
  levelTerm?: string | null;
  numeratorId: string;
  perFactor?: number | null;
  topicTerm: string;
  unitId?: string | null;
  updatedAt: string;
  version: number;
}
