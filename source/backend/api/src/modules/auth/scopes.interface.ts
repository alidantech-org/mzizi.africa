
import type { Flag } from "#/modules/shared/flag.type.ts";
import type { Id } from "#/modules/shared/id.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/non-empty-string255.type.ts";
import type { Sha256 } from "#/modules/shared/sha256.type.ts";
import type { Instant } from "#/modules/shared/instant.type.ts";

/** Deduplicated access scope: global, or narrowed by country, geographic unit, dataset or field group. */
export interface Scopes {
  countryRefId?: Id | null;
  createdAt: Instant;
  datasetRefId?: Id | null;
  fieldGroup?: NonEmptyString255 | null;
  geographicUnitRefId?: Id | null;
  id: Id;
  includeDescendants: Flag;
  institutionRefId: Id;
  isGlobal: Flag;
  scopeHash: Sha256;
}