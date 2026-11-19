import type { FieldMeta } from "#/_archives/lib/dryv/transport";
import { type FeatureKind } from "#/_archives/lib/types/feature-kind";

/** Feature Kind Collection */
export interface FeatureKindCollection {
  kinds: FeatureKind[];
}

/** Field metadata for forms and results. */
export const FeatureKindCollectionFields: readonly FieldMeta[] = [
  { name: "kinds", label: "Kinds", kind: "other", required: true },
];
