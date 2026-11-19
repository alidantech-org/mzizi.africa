import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/** Nearby Projects Projects Media */
export interface NearbyProjectsProjectsMedia {
  embedUrl?: String | null;
  kind: String;
  mimeType?: String | null;
  platform?: String | null;
  stored: Flag;
  thumbnailUrl?: String | null;
  title: String;
  url: String;
}
