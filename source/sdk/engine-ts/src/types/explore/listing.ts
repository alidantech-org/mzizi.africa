import type { ExploreEntry } from "#sdk/types/explore/entry.ts";

/** Listing */
export interface ExploreListing {
  entries: ExploreEntry[];
  parent: string | null;
  path: string;
  root: string;
}
