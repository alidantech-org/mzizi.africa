import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type FeatureKind } from "#/lib/types/feature-kind.ts";

/** Feature Kind Collection */
export interface FeatureKindCollection {
  kinds: FeatureKind[];
}

/** Field metadata for forms and results. */
export const FeatureKindCollectionFields: readonly FieldMeta[] = [
  { name: "kinds", label: "Kinds", kind: "other", required: true },
];
