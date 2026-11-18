import type { ExploreColumnPlan } from "#sdk/types/explore/column-plan.ts";

/** Prepare Request */
export interface ExplorePrepareRequest {
  columns: ExploreColumnPlan[];
  path: string;
  root: string;
  save_as?: string;
  skip_empty_rows?: boolean;
}
