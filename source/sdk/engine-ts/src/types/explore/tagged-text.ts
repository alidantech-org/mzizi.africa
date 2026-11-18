import type { ExploreTermHit } from "#sdk/types/explore/term-hit.ts";

/** Tagged Text */
export interface ExploreTaggedText {
  hits: ExploreTermHit[];
  text: string;
}
