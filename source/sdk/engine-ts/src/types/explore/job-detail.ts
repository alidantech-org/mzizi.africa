import type { ExploreListing } from "#sdk/types/explore/listing.ts";

/** Job Detail */
export interface ExploreJobDetail {
  events: unknown[];
  job: unknown;
  output: ExploreListing | null;
}
