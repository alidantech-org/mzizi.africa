import type { String } from "#/modules/shared/schema/type/string.type.ts";

/** Manifesto */
export interface Manifesto {
  code: String;
  election?: String | null;
  party?: String | null;
  publishedOn?: String | null;
}
