
import type { Flag } from "#/modules/shared/flag.type.ts";
import type { Id } from "#/modules/shared/id.type.ts";

/** Optional physical-place attributes for a feature; does not create a separate identity. */
export interface Places {
  featureId: Id;
  isInhabited?: Flag | null;
}