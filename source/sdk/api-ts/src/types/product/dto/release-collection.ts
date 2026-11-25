import type { ProductReleaseEntry } from "#sdk/types/product/dto/release-entry.ts";

/** Release Collection */
export interface ProductReleaseCollection {
  releases: ProductReleaseEntry[];
}
