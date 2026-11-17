import { ReferenceValueRelationKind } from "#sdk/types/enums/reference/value-relation-kind.ts";

/** A directed, typed, time-aware relation between classification values; supports multi-parent and cross-scheme taxonomy, such as a regional label that maps to a broader global kind. */
export interface ReferenceValueRelation {
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  relationKind: ReferenceValueRelationKind;
  sourceValueId: string;
  targetValueId: string;
  validFrom?: string | null;
  validUntil?: string | null;
}
