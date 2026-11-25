import type { FrontendSearchHit } from "#sdk/types/frontend/dto/search-hit.ts";

/** Search Results */
export interface FrontendSearchResults {
  hits: FrontendSearchHit[];
  language: string;
}
