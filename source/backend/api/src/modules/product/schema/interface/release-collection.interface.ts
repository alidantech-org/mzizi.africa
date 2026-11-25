import type { ReleaseEntry } from "#/modules/product/schema/interface/release-entry.interface.ts";

/** Release Collection */
export interface ReleaseCollection {
  releases: ReleaseEntry[];
}
