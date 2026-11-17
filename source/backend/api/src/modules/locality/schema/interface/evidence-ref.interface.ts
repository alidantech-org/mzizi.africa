import type { Confidence } from "#/modules/shared/schema/type/confidence.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { NonEmptyString100 } from "#/modules/shared/schema/type/non-empty-string100.type.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/** Evidence Ref */
export interface EvidenceRef {
  artifactTitle?: Name | null;
  citationId: Id;
  confidence?: Confidence | null;
  locator?: NonEmptyString500 | null;
  publisherName?: Name | null;
  retrievedAt?: Instant | null;
  sourceName: Name;
  verification?: NonEmptyString100 | null;
}
