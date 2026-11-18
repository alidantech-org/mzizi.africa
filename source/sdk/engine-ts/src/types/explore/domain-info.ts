import type { ExploreTableInfo } from "#sdk/types/explore/table-info.ts";

/** Domain Info */
export interface ExploreDomainInfo {
  domain: string;
  tables: ExploreTableInfo[];
}
