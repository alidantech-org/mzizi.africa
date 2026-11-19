import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/** Project Detail Evidence */
export interface ProjectDetailEvidence {
  artifactTitle: String;
  citationId: String;
  confidence?: Number | null;
  locator: String;
  publisherName?: String | null;
  retrievedAt: String;
  sourceName: String;
  verification?: String | null;
}
