import { SharedIdentityKind } from "#sdk/types/shared/enums/identity-kind.ts";
import { StatisticsAggregation } from "#sdk/types/statistics/enums/aggregation.ts";
import { StatisticsFrequency } from "#sdk/types/statistics/enums/frequency.ts";

/** The concept measured (Population). Its names and short definitions are `identity.names`. */
export interface StatisticsIndicators {
  aggregation: StatisticsAggregation;
  code: string;
  createdAt: string;
  decimals?: number | null;
  deletedAt?: string | null;
  frequency?: StatisticsFrequency | null;
  higherIsBetter?: boolean | null;
  id: string;
  identityKind: SharedIdentityKind;
  isDerived: boolean;
  kindTerm: string;
  roleTerm?: string | null;
  topicTerm: string;
  unitId?: string | null;
  updatedAt: string;
  version: number;
}
