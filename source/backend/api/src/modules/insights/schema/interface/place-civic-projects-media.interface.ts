import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/** Place Civic Projects Media */
export interface PlaceCivicProjectsMedia {
  embedUrl?: String | null;
  kind: String;
  mimeType?: String | null;
  platform: String;
  stored: Flag;
  thumbnailUrl?: String | null;
  title: String;
  url: String;
}
